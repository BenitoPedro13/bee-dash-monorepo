import { useState } from "react";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import ModalContent from "./ModalContent";
import useDataStore from "@/store";
import { hexToRgba } from "../../utils/utils";

export function ModalRelatorio() {
  const [open, setOpen] = useState(false);
  const color = useDataStore((store) => store.session.user.color);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="custom">Ver Relatório</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[794px] h-[90%]">
          <ModalContent hexColor={hexColor} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="custom">Ver Relatório</Button>
      </DrawerTrigger>
      <DrawerContent>
        <ModalContent hexColor={hexColor} />
      </DrawerContent>
    </Drawer>
  );
}
