export class CreateAttachmentDto {
  uniqueFilename: string;
  originalFilename: string;
  fileSize: number;
  userEmail: string; // Add the userId property to represent the owner of the attachment
}
