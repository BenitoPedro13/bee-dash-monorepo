import Link from "next/link";
import React from "react";
import useDataStore from "@/store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import house from "@/../public/house.svg";
import chevronright from "@/../public/chevron-right.svg";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { getParam } from "@/lib/utils";

interface BreadcrumbProps {
  route: string;
  creator?: string;
  campaignId?: string;
  creatorSlug?: string;
}

const routeDisplayNames: { [key: string]: string } = {
  home: "Início",
  campaigns: "Campanhas",
  creators: "Creators",
};

const BreadcrumbComponent = ({ route, creator }: BreadcrumbProps) => {
  const session = useDataStore((state) => state.session);
  const pathSegments = route.split("/").filter(Boolean); // Split route and remove empty segments
  const params = useParams();

  const creatorId = getParam(params.creatorId);
  const campaignId = getParam(params.campaignId);

  return (
    <div className="flex w-fit h-auto flex-col justify-center items-start gap-3">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          {/* Map through the path segments to create breadcrumb items */}
          {pathSegments.map((segment, index) => {
            // Handle dynamic segments like campaignId and creatorSlug
            let displayName = routeDisplayNames[segment];

            // If it's a dynamic segment, replace with appropriate values
            if (index === 1 && segment === campaignId) {
              displayName =
                session.user?.campaigns.find(
                  (campaign) => campaign.id === +campaignId
                )?.name || `Campanha ${campaignId}`;
            } else if (segment === creatorId) {
              displayName = creator || `${creatorId}`;
            }

            return (
              <React.Fragment key={segment}>
                {index > 0 && index <= pathSegments.length - 1 && (
                  <BreadcrumbSeparator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M9.662 2H11.454L6.778 13.872H5L9.662 2Z"
                        fill="black"
                      />
                    </svg>
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  <Link
                    href={
                      segment === "creators"
                        ? "/creators"
                        : `/${pathSegments.slice(0, index + 1).join("/")}`
                    }
                  >
                    <p
                      className={
                        (index === pathSegments.length - 1
                          ? "text-black"
                          : "text-[#525866]") +
                        " font-nexa-bold text-sm font-bold"
                      }
                    >
                      {displayName || segment}
                    </p>
                  </Link>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}

          {/* Optional creator */}
          {creator && creatorId && !pathSegments.includes(creatorId) && (
            <>
              <BreadcrumbSeparator>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M9.662 2H11.454L6.778 13.872H5L9.662 2Z"
                    fill="black"
                  />
                </svg>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <p className="text-black font-nexa text-sm font-medium">
                  {creator}
                </p>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbComponent;
