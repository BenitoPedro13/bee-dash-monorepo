export class CreateAttachmentDto {
  uniqueFilename: string;
  originalFilename: string;
  fileSize: number;
  campaignId?: number;
}
