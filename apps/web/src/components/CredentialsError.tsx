import { TriangleAlert } from 'lucide-react';

export default function CredentialsError() {
  return(
    <div className="rounded-md w-full border border-red-800 flex flex-col justify-center items-center mb-4 py-2">
      <TriangleAlert />
      <p className="font-semibold text-black">Credenciais incorretas, tente novamente</p>
    </div>
  )
}