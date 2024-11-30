import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const ImageDialog = ({
  imgSrc,
  children,
  className,
}: {
  children: React.ReactNode;
  imgSrc: string;
  className: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger className={className}>{children}</DialogTrigger>
      <DialogContent className="max-w-[500px] max-h-[500px]  p-1 overflow-hidden">
        <img
          src={imgSrc}
          alt="message"
          className="w-full h-full mx-auto rounded-md object-cover object-top"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
