import * as Yup from "yup";

export const loginSchema = Yup.object({
  username: Yup.string().required("Kindly enter your Username!!"),
  password: Yup.string().required("Kindly enter your Password!!"),
});

export const signupSchema = Yup.object({
  name: Yup.string().required("Kindly enter your Username!!"),
  email: Yup.string().email().required("Kindly enter valid Email!!"),
  password: Yup.string().required("Kindly enter Password"),
});

export const formSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile is required"),
  address: Yup.string().required("Address is required"),
  familyMembers: Yup.number()
    .min(1, "At least 1 family member required")
    .required("Required"),
  products: Yup.array()
    .of(
      Yup.object().shape({
        productName: Yup.string().required("Product name is required"), // Make it always required
        brand: Yup.string().when("productName", {
          is: (productName) => !!productName,
          then: (schema) => schema.required("Brand name is required"),
        }),
        quantity: Yup.number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .when("productName", {
            is: (productName) => !!productName,
            then: (schema) =>
              schema
                .min(1, "Quantity must be at least 1")
                .required("Quantity is required"),
          }),
        price: Yup.number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ? null : value
          )
          .when("productName", {
            is: (productName) => !!productName,
            then: (schema) =>
              schema
                .min(1, "Price must be at least 1")
                .required("Price is required"),
          }),
      })
    )
    .min(1, "At least one product is required"),
});
