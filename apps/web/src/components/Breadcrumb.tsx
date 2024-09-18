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
  const { campaignId, slug } = useParams();
  return (
    <div className="flex w-fit h-auto flex-col justify-center items-start gap-3">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center">
          {/* Home icon */}
          <BreadcrumbItem className="flex items-center gap-2">
            <Link href="/campaigns">
              <Image src={house} alt="Home Icon" />
            </Link>
          </BreadcrumbItem>

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
            } else if (segment === slug) {
              displayName = creator || `${slug}`;
            }

            return (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator>
                  <Image src={chevronright} alt="Chevron Right Icon" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <Link
                    href={
                      segment === "creators"
                        ? "/campaigns"
                        : `/${pathSegments.slice(0, index + 1).join("/")}`
                    }
                  >
                    <p className="text-black font-nexa text-sm font-medium">
                      {displayName || segment}
                    </p>
                  </Link>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}

          {/* Optional creator */}
          {creator && slug && !pathSegments.includes(slug) && (
            <>
              <BreadcrumbSeparator>
                <Image src={chevronright} alt="Chevron Right Icon" />
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
