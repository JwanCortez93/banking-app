export const userMock: User = {
  $id: crypto.randomUUID(),
  address1: "Simbrón 4102",
  city: "Buenos Aires",
  dateOfBirth: "16/09/1993",
  dwollaCustomerId: crypto.randomUUID(),
  dwollaCustomerUrl: "",
  postalCode: "1417",
  ssn: "",
  state: "Buenos Aires",
  userId: crypto.randomUUID(),
  firstName: "Juan Martín",
  lastName: "Cortez",
  email: "jwancortez@gmail.com",
};

export const bank: Bank = {
  $id: crypto.randomUUID(),
  bankId: crypto.randomUUID(),
  accessToken: "",
  accountId: crypto.randomUUID(),
  fundingSourceUrl: "",
  sharableId: "",
  userId: crypto.randomUUID(),
};

export const firstAccount: Account = {
  id: crypto.randomUUID(),
  appwriteItemId: crypto.randomUUID(),
  institutionId: crypto.randomUUID(),
  sharableId: crypto.randomUUID(),
  availableBalance: 50000,
  currentBalance: 35214.25,
  mask: "1234",
  name: "Juan Martín Cortez",
  officialName: "Juan Martín Cortez",
  subtype: "",
  type: "",
};

export const secondAccount: Account = {
  id: crypto.randomUUID(),
  appwriteItemId: crypto.randomUUID(),
  institutionId: crypto.randomUUID(),
  sharableId: crypto.randomUUID(),
  availableBalance: 20000,
  currentBalance: 2648.25,
  mask: "5678",
  name: "Juan Martín Cortez",
  officialName: "Juan Martín Cortez",
  subtype: "",
  type: "",
};
