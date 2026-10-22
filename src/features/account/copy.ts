import type { AccountActionKind } from "./model";

export type SupportedLocale = "en" | "id";

export interface AccountActionCopy {
  badge: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  confirmationNotice?: string;
  loginNotice: string;
  revocationNote?: string;
}

export interface SharedAccountCopy {
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  requirementsTitle: string;
  reqLength: string;
  reqLetter: string;
  reqNumber: string;
  reqSymbol: string;
  reqMatch: string;
  noTrimHint: string;
  activeSessionTitle: string;
  activeSessionBody: (email: string | null) => string;
  leaveSessionConfirmButton: string;
  leaveSessionPendingButton: string;
  keepSessionCancelButton: string;
  cancelledSessionTitle: string;
  cancelledSessionBody: string;
  returnToWorkspaceLabel: string;
  completedHeading: string;
  completedSubheading: string;
  continueToSignInLabel: string;
  openInIosAppHint: string;
  actions: Record<AccountActionKind, AccountActionCopy>;
}

export const ACCOUNT_COPY: Record<SupportedLocale, SharedAccountCopy> = {
  en: {
    newPasswordLabel: "New password",
    newPasswordPlaceholder: "Enter new password",
    confirmPasswordLabel: "Confirm new password",
    confirmPasswordPlaceholder: "Re-enter new password",
    showPassword: "Show",
    hidePassword: "Hide",
    requirementsTitle: "Password requirements",
    reqLength: "8–128 characters",
    reqLetter: "At least one letter",
    reqNumber: "At least one number",
    reqSymbol: "At least one non-whitespace symbol",
    reqMatch: "Confirmation matches exactly",
    noTrimHint: "Spaces are preserved exactly as typed and are never trimmed.",
    activeSessionTitle: "You are currently signed in",
    activeSessionBody: (email) =>
      email
        ? `An active session for ${email} is open in this browser. We do not assume this email link belongs to that account. Confirm whether you want to leave your current session before continuing.`
        : "An active session is open in this browser. We do not assume this email link belongs to that account. Confirm whether you want to leave your current session before continuing.",
    leaveSessionConfirmButton: "Sign out & continue",
    leaveSessionPendingButton: "Signing out…",
    keepSessionCancelButton: "Keep current session",
    cancelledSessionTitle: "Current session kept",
    cancelledSessionBody:
      "Your existing session remains active and the email action token has been cleared from memory.",
    returnToWorkspaceLabel: "Return to workspace",
    completedHeading: "Sign in to continue",
    completedSubheading:
      "For your security, completing an email action does not sign you in automatically. Use your credentials on the sign-in screen or in the AdaPenyu iOS app.",
    continueToSignInLabel: "Go to sign in",
    openInIosAppHint:
      "Using AdaPenyu on iPhone or iPad? Open the AdaPenyu app and sign in with your updated account credentials.",
    actions: {
      "reset-password": {
        badge: "Account Security",
        title: "Reset your password",
        subtitle:
          "Choose a new password for your AdaPenyu account. Completing this reset will sign out existing sessions for the affected account.",
        submitLabel: "Reset password",
        submittingLabel: "Resetting password…",
        loginNotice:
          "Your password has been reset and existing sessions for this account have been signed out. Please sign in with your new password.",
        revocationNote: "Active sessions for the affected account are revoked upon completion.",
      },
      "accept-invitation": {
        badge: "Account Setup",
        title: "Accept invitation & set up account",
        subtitle:
          "Create a password to finish setting up your AdaPenyu ranger invitation or initial organisation owner account.",
        submitLabel: "Accept invitation & set password",
        submittingLabel: "Setting up account…",
        loginNotice:
          "Your AdaPenyu account is set up and ready. Please sign in with the password you just created.",
      },
      "confirm-email": {
        badge: "Email Verification",
        title: "Confirm your email address",
        subtitle:
          "Confirm this email address for your AdaPenyu account. Nothing is submitted until you select the button below.",
        submitLabel: "Confirm email address",
        submittingLabel: "Confirming email…",
        confirmationNotice:
          "Confirming your email address verifies ownership and signs out existing sessions for the affected account.",
        loginNotice:
          "Your email address has been confirmed and existing sessions for this account have been signed out. Please sign in to continue.",
        revocationNote: "Active sessions for the affected account are revoked upon completion.",
      },
    },
  },
  id: {
    newPasswordLabel: "Kata sandi baru",
    newPasswordPlaceholder: "Masukkan kata sandi baru",
    confirmPasswordLabel: "Konfirmasi kata sandi baru",
    confirmPasswordPlaceholder: "Masukkan ulang kata sandi baru",
    showPassword: "Tampilkan",
    hidePassword: "Sembunyikan",
    requirementsTitle: "Syarat kata sandi",
    reqLength: "8–128 karakter",
    reqLetter: "Minimal satu huruf",
    reqNumber: "Minimal satu angka",
    reqSymbol: "Minimal satu simbol non-spasi",
    reqMatch: "Konfirmasi harus sama persis",
    noTrimHint: "Spasi dipertahankan persis seperti yang diketik dan tidak pernah dipangkas.",
    activeSessionTitle: "Anda sedang masuk",
    activeSessionBody: (email) =>
      email
        ? `Sesi aktif untuk ${email} sedang terbuka di browser ini. Kami tidak mengasumsikan tautan email ini milik akun tersebut. Konfirmasi apakah Anda ingin keluar dari sesi saat ini sebelum melanjutkan.`
        : "Sesi aktif sedang terbuka di browser ini. Kami tidak mengasumsikan tautan email ini milik akun tersebut. Konfirmasi apakah Anda ingin keluar dari sesi saat ini sebelum melanjutkan.",
    leaveSessionConfirmButton: "Keluar & lanjutkan",
    leaveSessionPendingButton: "Keluar dari sesi…",
    keepSessionCancelButton: "Tetap di sesi saat ini",
    cancelledSessionTitle: "Sesi saat ini dipertahankan",
    cancelledSessionBody:
      "Sesi Anda tetap aktif dan token tautan email telah dihapus dari memori.",
    returnToWorkspaceLabel: "Kembali ke ruang kerja",
    completedHeading: "Masuk untuk melanjutkan",
    completedSubheading:
      "Demi keamanan, menyelesaikan tautan email tidak membuat Anda masuk secara otomatis. Silakan masuk di layar login atau melalui aplikasi iOS AdaPenyu.",
    continueToSignInLabel: "Menuju halaman masuk",
    openInIosAppHint:
      "Menggunakan AdaPenyu di iPhone atau iPad? Buka aplikasi AdaPenyu dan masuk menggunakan kredensial akun Anda.",
    actions: {
      "reset-password": {
        badge: "Keamanan Akun",
        title: "Atur ulang kata sandi",
        subtitle:
          "Buat kata sandi baru untuk akun AdaPenyu Anda. Menyelesaikan proses ini akan mengeluarkan seluruh sesi aktif pada akun terkait.",
        submitLabel: "Atur ulang kata sandi",
        submittingLabel: "Mengatur ulang kata sandi…",
        loginNotice:
          "Kata sandi Anda telah diatur ulang dan sesi aktif untuk akun ini telah dikeluarkan. Silakan masuk dengan kata sandi baru Anda.",
        revocationNote: "Sesi aktif pada akun terkait akan dicabut setelah selesai.",
      },
      "accept-invitation": {
        badge: "Pengaturan Akun",
        title: "Terima undangan & atur akun",
        subtitle:
          "Buat kata sandi untuk menyelesaikan undangan ranger atau pengaturan awal akun owner organisasi AdaPenyu Anda.",
        submitLabel: "Terima undangan & simpan kata sandi",
        submittingLabel: "Menyiapkan akun…",
        loginNotice:
          "Akun AdaPenyu Anda sudah siap. Silakan masuk dengan kata sandi yang baru Anda buat.",
      },
      "confirm-email": {
        badge: "Verifikasi Email",
        title: "Konfirmasi alamat email Anda",
        subtitle:
          "Konfirmasi alamat email ini untuk akun AdaPenyu Anda. Tidak ada aksi yang dikirim sebelum Anda menekan tombol di bawah.",
        submitLabel: "Konfirmasi alamat email",
        submittingLabel: "Mengonfirmasi email…",
        confirmationNotice:
          "Mengonfirmasi alamat email akan memverifikasi kepemilikan dan mengeluarkan sesi aktif pada akun terkait.",
        loginNotice:
          "Alamat email Anda telah dikonfirmasi dan sesi aktif untuk akun ini telah dikeluarkan. Silakan masuk untuk melanjutkan.",
        revocationNote: "Sesi aktif pada akun terkait akan dicabut setelah selesai.",
      },
    },
  },
};

export function getLoginNoticeForAction(
  notice: string | undefined,
  locale: SupportedLocale = "en",
): string | null {
  if (
    notice === "reset-password" ||
    notice === "accept-invitation" ||
    notice === "confirm-email"
  ) {
    return ACCOUNT_COPY[locale].actions[notice].loginNotice;
  }
  return null;
}
