import { TriangleAlert } from "lucide-react";

interface CredentialsErrorProps {
  show: boolean;
}

export default function CredentialsError({ show }: CredentialsErrorProps) {
  return (
    <div
      className={
        "rounded-md w-full border border-red-800 flex flex-col justify-center items-center mb-4 py-2 " +
        show
          ? "hidden"
          : "flex"
      }
    >
      <TriangleAlert />
      <p className="font-semibold text-black">
        Credenciais incorretas, tente novamente
      </p>
    </div>
  );
}
