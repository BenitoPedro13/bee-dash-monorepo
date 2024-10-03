import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    // Validate the input
    if (!email || !password) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: "Patty",
        email: process.env.ADMIN_EMAIL,
        roles: ["admin"],
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
