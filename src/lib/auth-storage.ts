export type RegisteredAccount = {
  name: string;
  email: string;
  password: string;
};

const REGISTERED_ACCOUNT_KEY = "arena:registered-account:v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  if (!isBrowser()) {
    return;
  }

  const normalizedAccount: RegisteredAccount = {
    ...account,
    email: normalizeEmail(account.email),
  };

  window.localStorage.setItem(
    REGISTERED_ACCOUNT_KEY,
    JSON.stringify(normalizedAccount),
  );
}

export function getRegisteredAccount(): RegisteredAccount | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(REGISTERED_ACCOUNT_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as RegisteredAccount;

    if (!parsed.name || !parsed.email || !parsed.password) {
      return null;
    }

    return {
      ...parsed,
      email: normalizeEmail(parsed.email),
    };
  } catch {
    return null;
  }
}

export function isRegisteredCredentialValid(email: string, password: string) {
  const account = getRegisteredAccount();

  if (!account) {
    return { valid: false as const, account: null };
  }

  const valid = account.email === normalizeEmail(email) && account.password === password;

  return {
    valid,
    account,
  };
}
