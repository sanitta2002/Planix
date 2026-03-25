export interface IOtpService {
  sendOtp(key: string): Promise<string | null>;
  verifyOtp(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}
