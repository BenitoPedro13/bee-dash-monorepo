import { NextRequest, NextResponse } from "next/server";
import createPool from "../../../../database";

const pool = createPool();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const input = url.searchParams.get("input");
    let inputLower: string | undefined;

    if (typeof input === "string") {
      inputLower = input.toLowerCase();
    } else {
      inputLower = undefined;
    }

    const query = `
      SELECT users.id, creators.id AS creator_id, social_newtorks.profile, users.name, users.image, users.state
      FROM creators
      LEFT JOIN users ON users.id = creators.user_id
      LEFT JOIN social_newtorks ON social_newtorks.creator_id = creators.id
      WHERE lower(users.name) LIKE '${inputLower}%'
        OR lower(social_newtorks.profile) LIKE '${inputLower}%'
        AND users.name NOT LIKE 'Usuario desativado'
      GROUP BY users.id, social_newtorks.profile, creators.id
      ORDER BY social_newtorks.profile, users.name ASC
      LIMIT 7
    `;

    const result = await pool.query(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
