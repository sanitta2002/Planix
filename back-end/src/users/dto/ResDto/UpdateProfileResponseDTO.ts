export interface UpdateProfileResponseDTO {
  message: string;
  data: {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}
