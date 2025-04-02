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
        productName: Yup.string().when(["brand", "quantity", "price"], {
          is: (brand, quantity, price) => brand || quantity || price, // Validate only if one of them is filled
          then: (schema) => schema.required("Select a product"),
        }),
        brand: Yup.string().when(["productName", "quantity", "price"], {
          is: (productName, quantity, price) =>
            productName || quantity || price,
          then: (schema) => schema.required("Enter brand name"),
        }),
        quantity: Yup.number()
          .nullable()
          .when(["productName", "brand", "price"], {
            is: (productName, brand, price) => productName || brand || price,
            then: (schema) =>
              schema.min(1, "You should add Quantity!!").required("Required"),
          }),
        price: Yup.number()
          .nullable()
          .when(["productName", "brand", "quantity"], {
            is: (productName, brand, quantity) =>
              productName || brand || quantity,
            then: (schema) =>
              schema.min(1, "You should add Price!!").required("Required"),
          }),
      })
    )
    .min(1, "At least one product required"),
});
