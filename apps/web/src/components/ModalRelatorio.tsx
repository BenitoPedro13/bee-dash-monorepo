import {useState} from "react"

import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ModalContent from "./ModalContent";

export function ModalRelatorio() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Ver Relatório</Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[794px] h-[90%]">
          <ModalContent/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Ver Relatório</Button>
      </DrawerTrigger>
      <DrawerContent>
        <ModalContent/>
      </DrawerContent>
    </Drawer>
  )
}
