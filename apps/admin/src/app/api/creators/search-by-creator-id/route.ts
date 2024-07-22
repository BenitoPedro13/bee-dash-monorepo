import { NextRequest, NextResponse } from "next/server";
import createPool from "../../../../database";

const pool = createPool();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const input = url.searchParams.get("input");

    // Validate the input as a UUID
    if (!input) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const query = `
      SELECT users.id, creators.id AS creator_id, social_newtorks.profile, users.name, users.image, users.state
      FROM creators
      LEFT JOIN users ON users.id = creators.user_id
      LEFT JOIN social_newtorks ON social_newtorks.creator_id = creators.id
      WHERE creators.id = $1
    `;

    const result = await pool.query(query, [input]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
