export class CreateCreatorDto {
  urlProfilePicture: string;
  name: string;
  categories: { id: number }[];
}
