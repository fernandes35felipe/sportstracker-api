import { Injectable } from '@nestjs/common';

// Auth is handled by the Zeni Wallet backend.
// This service exists only to satisfy the module structure.
// Users authenticate via the wallet and send the JWT to this API.
@Injectable()
export class AuthService {}
