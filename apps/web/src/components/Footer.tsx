import Image from "next/image";
import Link from "next/link";

import logo from "@/../public/logo.svg";
import { Plus_Jakarta_Sans } from "next/font/google";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

interface Props {}

const Footer = (props: Props) => {
  return (
    // <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-6 rounded-none">
    //   <footer className="box-border w-full h-min flex flex-col justify-start items-center pt-16 pb-12 bg-white overflow-visible content-center flex-nowrap gap-16 rounded-none">
    //     <div className="box-border flex-shrink-0 flex-grow w-full h-min flex flex-col justify-start items-start px-8 overflow-visible relative content-start flex-nowrap gap-12 rounded-none">
    //       <div className="flex-shrink-0 w-full h-min flex md:flex-row flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-16 rounded-none">
    //         <div className="flex-shrink-0 w-[320px] h-min flex flex-col justify-start overflow-visible relative p-0 content-start flex-nowrap gap-[15px] rounded-none">
    //           <p
    //             className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative ${jakarta.className} text-[#475466] text-base`}
    //           >
    //             Juicy Dashboard v0.1 Alfa
    //           </p>
    //           <Link href="/">
    //             <Image src={logo} width={134} height={undefined} alt="Logo" />
    //           </Link>
    //           <p
    //             className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative ${jakarta.className} text-[#475466] text-base`}
    //           >
    //             Nosso propósito é democratizar a economia criativa com um
    //             incrível pacote de ferramentas que vão deixar o seu dia a dia
    //             muito mais rápido e divertido!
    //           </p>
    //         </div>
    //         <div className="flex-shrink-0 flex-grow w-auto h-min flex justify-start overflow-visible relative p-0 content-start flex-nowrap gap-8 rounded-none">
    //           <div className="flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-4 rounded-none">
    //             <p
    //               className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#667084] text-sm`}
    //             >
    //               Product
    //             </p>
    //             <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-3 rounded-none">
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <Link
    //                     href="https://welcome.juicy.space/lab"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Juicy Lab
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://welcome.juicy.space/log"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Juicy Log
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://juicyapp.com.br"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Juicy App
    //                     </p>
    //                   </Link>
    //                 </div>
    //                 <div className="box-border flex justify-start items-center flex-grow-0 flex-shrink-0 relative px-2 py-0.5 rounded-2xl bg-[#f9f5ff] mix-blend-multiply">
    //                   <p className="whitespace-pre-wrap flex-grow-0 flex-shrink-0 text-xs leading-[18px] font-medium text-center text-[#FF8C00]">
    //                     New
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-4 rounded-none">
    //             <p
    //               className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#667084] text-sm`}
    //             >
    //               Social
    //             </p>
    //             <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-3 rounded-none">
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <Link
    //                     href="https://twitter.com/juicy_space"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Twitter
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://www.linkedin.com/company/juicy-space/"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       LinkedIn
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://www.instagram.com/juicy.space/"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Instagram
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-4 rounded-none">
    //             <p
    //               className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#667084] text-sm`}
    //             >
    //               Legal
    //             </p>
    //             <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-3 rounded-none">
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <Link
    //                     href="https://juicyapp.com.br/terms/privacy"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Terms
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://juicyapp.com.br/terms/privacy"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Privacy
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //               <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                 <div className="flex-shrink-0 w-fit h-min flex justify-start items-center overflow-hidden relative p-0 content-center flex-nowrap gap-2 rounded-none">
    //                   <Link
    //                     href="https://juicyapp.com.br/terms/cookies"
    //                     target="_blank"
    //                   >
    //                     <p className="flex-shrink-0 w-auto h-auto whitespace-pre-wrap relative leading-[1.2] text-black font-semibold">
    //                       Cookies
    //                     </p>
    //                   </Link>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="box-border flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start px-8 overflow-visible relative content-start flex-nowrap gap-[22px] rounded-none">
    //       <div className="box-border flex-shrink-0 w-full h-min flex justify-start items-center pt-8 overflow-visible relative content-center flex-nowrap gap-8 rounded-none border-[#eaecf0] border-solid border-t">
    //         <p
    //           className={`flex-shrink-0 flex-grow w-fit  h-auto whitespace-pre-wrap break-words relative ${jakarta.className} text-[#475466] text-base`}
    //         >
    //           © 2023 Juicy Technology. Todos os direitos reservados.
    //         </p>
    //         <div className="flex-shrink-0 w-min h-min hidden sm:flex  justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-6 rounded-none">
    //           <svg
    //             viewBox="0 0 24 24"
    //             aria-hidden="true"
    //             className="h-6 w-6 fill-slate-400"
    //           >
    //             <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
    //           </svg>
    //           <svg
    //             viewBox="0 0 24 24"
    //             aria-hidden="true"
    //             className="h-6 w-6 fill-slate-400"
    //           >
    //             <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
    //           </svg>
    //           <svg
    //             viewBox="0 0 24 24"
    //             aria-hidden="true"
    //             className="h-6 w-6 fill-slate-400"
    //           >
    //             <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
    //           </svg>
    //         </div>
    //       </div>
    //       <p
    //         className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${jakarta.className} text-[#667084] text-[10px] leading-[1.2]`}
    //       >
    //         Por favor, note que esta plataforma está atualmente na fase Alfa de
    //         desenvolvimento. Isso significa que estamos ativamente testando e
    //         aprimorando suas funcionalidades. Durante este período, é possível
    //         que você encontre instabilidades ou mudanças. Agradecemos sua
    //         paciência e compreensão. Seu feedback é extremamente valioso para
    //         nós nesta etapa. Obrigado por apoiar nosso compromisso contínuo com
    //         a melhoria e inovação.
    //       </p>
    //     </div>
    //   </footer>
    // </div>
    // <div className="box-border flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-full h-fit">
    //   <div className="box-border flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-12 py-12 bg-white">
    //     <div className="box-border flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 px-4">
    //       <div className="box-border flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8">

    //       </div>
    //     </div>
    //     <div className="box-border flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 px-4">
    //       <div className="box-border flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-6 pt-8 border-t border-r-0 border-b-0 border-l-0 border-[#eaecf0]">
    //         <div className="box-border flex justify-start items-start flex-grow-0 flex-shrink-0 relative">
    //           <div className="flex flex-row items-start p-0 h-8 w-auto cursor-pointer">
    //             <div className="h-8 w-auto">
    //               <Link href='/'>
    //                 <Image src={logo} width={88} height={undefined} alt='Logo'/>
    //               </Link>
    //             </div>
    //           </div>
    //         </div>
    //         <p className="whitespace-pre-wrap flex-grow-0 flex-shrink-0 self-stretch text-base leading-6 text-left text-[#667085]">
    //           © 2023 Untitled UI. All rights reserved.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex w-full h-min pb-4 xl:p-[22px] xl:pl-[104px] xl:pt-0 xl:pb-8 px-[15px] py-0 flex-col items-start z-20 relative">
      <footer className="flex w-full pt-16 pb-12 flex-col items-center gap-16 self-stretch rounded-xl bg-white">
        <div className="flex px-8 flex-col items-start gap-8 self-stretch">
          <div className="flex pt-8 justify-between items-center self-stretch border-t-[1px] border-t-[#EAECF0] max-[670px]:flex-col max-[670px]:gap-4">
            <div className="flex items-start gap-[6px]">
              <div className="flex items-center gap-[5px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="53"
                  height="37"
                  viewBox="0 0 53 37"
                  fill="none"
                >
                  <path
                    d="M20.2517 26.117C19.9027 28.036 19.3503 29.7079 18.5943 31.1327C17.8674 32.5574 16.7334 33.8658 15.1924 35.058C14.9598 35.2324 14.48 35.3778 13.7531 35.4941C13.0553 35.6395 12.2121 35.7558 11.2235 35.843C10.2639 35.9303 9.21719 35.9884 8.08322 36.0175C6.97832 36.0756 5.90249 36.0902 4.85575 36.0611C3.83807 36.0611 2.90763 36.0175 2.06442 35.9303C1.22121 35.8721 0.610603 35.7703 0.23261 35.625C-3.85609e-08 32.2812 -0.0581526 28.8938 0.0581527 25.4628C0.174458 22.0318 0.23261 18.6444 0.23261 15.3006C0.23261 14.6609 0.23261 13.6723 0.23261 12.3348C0.261687 10.9682 0.276225 9.55803 0.276225 8.10422C0.305301 6.6504 0.334378 5.29835 0.363454 4.04807C0.421607 2.79779 0.494297 1.94004 0.581526 1.47482C2.23888 0.718831 4.34691 0.25361 6.90563 0.0791528C9.49342 -0.124382 12.1975 0.0646131 15.0179 0.646139C16.0356 0.87875 16.8788 1.34397 17.5476 2.0418C18.2163 2.73964 18.7252 3.58285 19.0741 4.57144C19.423 5.53096 19.612 6.57771 19.6411 7.71169C19.6992 8.81659 19.612 9.89241 19.3794 10.9392C19.1758 11.9859 18.856 12.96 18.4198 13.8613C17.9837 14.7336 17.4603 15.4169 16.8497 15.9112C17.7511 16.4055 18.4635 17.0452 18.9868 17.8302C19.5102 18.6153 19.8882 19.4731 20.1208 20.4035C20.3825 21.3339 20.5133 22.2935 20.5133 23.2821C20.5133 24.2707 20.4261 25.2156 20.2517 26.117ZM12.6191 7.84253C12.5028 7.31915 12.2847 6.92662 11.9649 6.66494C11.6741 6.37417 11.3398 6.18518 10.9618 6.09795C10.6129 5.98165 10.2494 5.95257 9.87141 6.01072C9.52249 6.0398 9.21719 6.11249 8.95551 6.22879C8.60659 6.40325 8.35944 6.79578 8.21406 7.40638C8.09775 8.01699 8.02506 8.70028 7.99599 9.45626C7.96691 10.1832 7.95237 10.8955 7.95237 11.5934C7.98145 12.2912 7.99599 12.8146 7.99599 13.1635C7.96691 14.1521 8.12683 14.69 8.47575 14.7772C8.85374 14.8645 9.46434 14.7336 10.3076 14.3847C11.0054 14.123 11.5433 13.7305 11.9213 13.2071C12.2993 12.6837 12.561 12.1167 12.7064 11.5061C12.8517 10.8955 12.9099 10.2704 12.8808 9.63072C12.8517 8.96197 12.7645 8.3659 12.6191 7.84253ZM13.1425 22.1917C13.1425 21.7265 12.968 21.3921 12.6191 21.1886C12.2702 20.985 11.8486 20.8542 11.3543 20.796C10.8891 20.7379 10.3948 20.7379 9.87141 20.796C9.34804 20.8251 8.89735 20.8396 8.51936 20.8396C8.37398 20.8396 8.24314 21.0723 8.12683 21.5375C8.0396 22.0027 7.95237 22.5551 7.86514 23.1948C7.80699 23.8054 7.74884 24.4451 7.69069 25.1139C7.63253 25.7535 7.60346 26.2624 7.60346 26.6404C7.60346 26.873 7.58892 27.2219 7.55984 27.6871C7.55984 28.1233 7.57438 28.5739 7.60346 29.0392C7.66161 29.5044 7.7343 29.9405 7.82153 30.3476C7.93784 30.7256 8.11229 30.9727 8.3449 31.089C8.66474 31.2635 8.99912 31.3217 9.34804 31.2635C9.69695 31.1763 10.0313 31.06 10.3512 30.9146C11.1362 30.5948 11.7178 30.0859 12.0957 29.3881C12.5028 28.6903 12.779 27.9197 12.9244 27.0765C13.0989 26.2042 13.1716 25.3319 13.1425 24.4596C13.1425 23.5874 13.1425 22.8314 13.1425 22.1917Z"
                    fill="#171717"
                  />
                  <path
                    d="M36.4831 28.2977C36.5121 28.8211 36.5121 29.3735 36.4831 29.9551C36.4831 30.5075 36.454 31.0454 36.3958 31.5688C36.3377 32.0631 36.2504 32.5283 36.1341 32.9645C36.0469 33.3715 35.9306 33.6768 35.7852 33.8804C34.8257 34.113 33.779 34.3311 32.645 34.5346C31.5401 34.709 30.3916 34.8399 29.1994 34.9271C28.0364 35.0144 26.8588 35.0434 25.6667 35.0144C24.4745 34.9853 23.2969 34.869 22.1339 34.6654C21.9885 33.735 21.9013 32.5283 21.8722 31.0454C21.8431 29.5625 21.8431 28.007 21.8722 26.3787C21.9013 24.7504 21.9449 23.1657 22.003 21.6247C22.0612 20.0546 22.1048 18.7461 22.1339 17.6994C22.163 16.4782 22.163 15.1843 22.1339 13.8177C22.1339 12.4221 22.1339 11.0118 22.1339 9.58711C22.163 8.16237 22.2066 6.76671 22.2647 5.40012C22.3229 4.00446 22.4247 2.68148 22.57 1.4312C23.0353 1.22767 23.8349 1.03867 24.9688 0.864214C26.1028 0.689755 27.324 0.558911 28.6325 0.471683C29.9409 0.384454 31.2057 0.355377 32.4269 0.384453C33.6481 0.384453 34.564 0.457144 35.1746 0.602525C35.2619 0.835136 35.3345 1.25674 35.3927 1.86735C35.4799 2.44887 35.5381 3.07401 35.5672 3.74277C35.5962 4.38245 35.5962 5.00759 35.5672 5.61819C35.5381 6.19972 35.4654 6.59225 35.3491 6.79578C35.1165 6.73763 34.7239 6.70855 34.1715 6.70855C33.6481 6.67948 33.0811 6.66494 32.4705 6.66494C31.889 6.66494 31.322 6.67948 30.7696 6.70855C30.2462 6.73763 29.8682 6.76671 29.6356 6.79578C29.5193 7.34823 29.4175 7.98791 29.3303 8.71482C29.2721 9.44173 29.2285 10.1832 29.1994 10.9392C29.1994 11.6951 29.2285 12.4366 29.2867 13.1635C29.3448 13.8613 29.4611 14.4429 29.6356 14.9081C30.0427 14.8208 30.5079 14.7627 31.0312 14.7336C31.5546 14.6755 32.0925 14.6464 32.645 14.6464C33.2265 14.6173 33.779 14.5882 34.3023 14.5592C34.8548 14.5301 35.3491 14.4719 35.7852 14.3847C35.8725 15.1698 35.9306 16.0857 35.9597 17.1324C35.9888 18.1792 35.8725 19.0515 35.6108 19.7493C35.2619 19.9819 34.8257 20.1854 34.3023 20.3599C33.779 20.5053 33.2265 20.6361 32.645 20.7524C32.0635 20.8687 31.4819 20.9705 30.9004 21.0577C30.3189 21.1449 29.7955 21.2322 29.3303 21.3194C29.2721 22.2789 29.2285 23.3111 29.1994 24.416C29.1994 25.5209 29.2285 26.5531 29.2867 27.5127C29.2867 27.8325 29.3739 28.1378 29.5484 28.4286C29.7228 28.6903 29.8973 28.8066 30.0717 28.7775C31.0894 28.6321 32.1652 28.5449 33.2992 28.5158C34.4623 28.4576 35.5235 28.385 36.4831 28.2977Z"
                    fill="#171717"
                  />
                  <path
                    d="M52.9782 28.2977C53.0073 28.8211 53.0073 29.3735 52.9782 29.9551C52.9782 30.5075 52.9491 31.0454 52.891 31.5688C52.8328 32.0631 52.7456 32.5283 52.6293 32.9645C52.542 33.3715 52.4257 33.6768 52.2804 33.8804C51.3208 34.113 50.2741 34.3311 49.1401 34.5346C48.0352 34.709 46.8867 34.8399 45.6946 34.9271C44.5315 35.0144 43.3539 35.0434 42.1618 35.0144C40.9697 34.9853 39.7921 34.869 38.629 34.6654C38.4836 33.735 38.3964 32.5283 38.3673 31.0454C38.3383 29.5625 38.3383 28.007 38.3673 26.3787C38.3964 24.7504 38.44 23.1657 38.4982 21.6247C38.5563 20.0546 38.5999 18.7461 38.629 17.6994C38.6581 16.4782 38.6581 15.1843 38.629 13.8177C38.629 12.4221 38.629 11.0118 38.629 9.58711C38.6581 8.16237 38.7017 6.76671 38.7599 5.40012C38.818 4.00446 38.9198 2.68148 39.0652 1.4312C39.5304 1.22767 40.33 1.03867 41.464 0.864214C42.5979 0.689755 43.8191 0.558911 45.1276 0.471683C46.436 0.384454 47.7008 0.355377 48.922 0.384453C50.1432 0.384453 51.0592 0.457144 51.6698 0.602525C51.757 0.835136 51.8297 1.25674 51.8878 1.86735C51.9751 2.44887 52.0332 3.07401 52.0623 3.74277C52.0914 4.38245 52.0914 5.00759 52.0623 5.61819C52.0332 6.19972 51.9605 6.59225 51.8442 6.79578C51.6116 6.73763 51.2191 6.70855 50.6666 6.70855C50.1432 6.67948 49.5763 6.66494 48.9657 6.66494C48.3841 6.66494 47.8171 6.67948 47.2647 6.70855C46.7413 6.73763 46.3633 6.76671 46.1307 6.79578C46.0144 7.34823 45.9126 7.98791 45.8254 8.71482C45.7673 9.44173 45.7236 10.1832 45.6946 10.9392C45.6946 11.6951 45.7236 12.4366 45.7818 13.1635C45.84 13.8613 45.9563 14.4429 46.1307 14.9081C46.5378 14.8208 47.003 14.7627 47.5264 14.7336C48.0498 14.6755 48.5877 14.6464 49.1401 14.6464C49.7216 14.6173 50.2741 14.5882 50.7975 14.5592C51.3499 14.5301 51.8442 14.4719 52.2804 14.3847C52.3676 15.1698 52.4257 16.0857 52.4548 17.1324C52.4839 18.1792 52.3676 19.0515 52.1059 19.7493C51.757 19.9819 51.3208 20.1854 50.7975 20.3599C50.2741 20.5053 49.7216 20.6361 49.1401 20.7524C48.5586 20.8687 47.9771 20.9705 47.3955 21.0577C46.814 21.1449 46.2906 21.2322 45.8254 21.3194C45.7673 22.2789 45.7236 23.3111 45.6946 24.416C45.6946 25.5209 45.7236 26.5531 45.7818 27.5127C45.7818 27.8325 45.869 28.1378 46.0435 28.4286C46.2179 28.6903 46.3924 28.8066 46.5669 28.7775C47.5845 28.6321 48.6604 28.5449 49.7943 28.5158C50.9574 28.4576 52.0187 28.385 52.9782 28.2977Z"
                    fill="#171717"
                  />
                </svg>
                <p className="text-[#171717] font-nexa text-base font-extrabold tracking-[3.124px] uppercase">
                  company
                </p>
              </div>
            </div>
            <p className="text-[#667085] font-nexa text-base font-semibold max-[670px]:text-center">
              © {new Date().getFullYear()} That{"'"}s Bee Company.{" "}
              <span className="font-normal">All Rights Reserved.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
