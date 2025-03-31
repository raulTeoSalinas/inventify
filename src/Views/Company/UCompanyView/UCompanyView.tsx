
// React
import React, {useEffect, useState} from 'react';
// React Native

// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  TextInput,
  PillButton,
  ImagePicker
} from "../../../designSystem";
import { UCompanyViewProps } from "./UCompanyView.model";
import useUCompanyView from "./UCompanyView.controller";
import { useMainContext } from '../../../contexts/mainContext';
import { useValidator } from '../../../hooks/useValidator/useValidator';
import { useToast } from '../../../hooks/useToast/useToast';
import useNavigation from '../../../navigation/useNavigation/useNavigation';
import { Company, Logo } from '../../../viewModels/useCompany/useCompany.model';
import { ENDPOINT } from '../../../constants/endpoints';
import { useAppSelector } from '../../../store/hooks';




const UCompanyView: React.FC<UCompanyViewProps> = (props) => {

  const {company} = useMainContext()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");

  const [logoUri, setLogoUri] = useState("");

  const token = useAppSelector((state) => state.auth.access_token);

  const { validateAll, validationStates, validateSingle } = useValidator({
    name: { value: name, validation: "notEmpty" },
    email: { value: email, validation: "email" },
    tel: { value: tel, validation: "notEmpty" },
    address: { value: address, validation: "notEmpty" },
    logo: { value: logoUri, validation: "notNull" },
  });

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleUpdate = async () => {
    const isValidated = validateAll();

    if (!isValidated) return;

    const companyData: { 
      name: string; 
      email: string; 
      tel: string; 
      address: string; 
      logo?: Logo 
    } = {
      name,
      email,
      tel,
      address,
    }

    if (!logoUri.startsWith(`${ENDPOINT.assets}`)) {
      const logoId = await uploadLogo(logoUri);
      companyData.logo = { id: logoId } as Logo;
     }

    try {
      await company.crud.update(companyData)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "UCOMPANY_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "UCOMPANY_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  const uploadLogo = async (imageUri: string) => {


    const formData = new FormData();
    // Send the image as file using FormData class. I followed Directus Documentation. 
    formData.append('file', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg'
    } as unknown as Blob);

    try {

        const response = await fetch(ENDPOINT.files, {
            method: 'POST',
            body: formData,
            headers: {
                authorization: `Bearer ${token}`,
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Return the id of the image so we can use it to create relations with user.
            return data.data.id;
        } else {
            console.error("Error sending image to Directus:", response.status, response.statusText);
        }

    } catch (e) {
        console.log(e)
    }
  }

  useEffect(() => {
    if (company.one.get) {
      const { name, email, tel, address, logo } = company.one.get;
      setName(name);
      setEmail(email);
      setTel(tel);
      setAddress(address);

      setLogoUri(`${ENDPOINT.assets}/${logo.id}?access_token=${token}`);
    }
  }, [company.one.get, token]);

  return (
    <ViewLayout>

      <Header backButton headerSize="extraLarge" copyIDTitle={"UCOMPANY_HEADER"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <ImagePicker
          imageUri={logoUri}
          setImageUri={setLogoUri}
          isError={!validationStates.logo}
          labelCopyID='UCOMPANY_LOGO_LABEL'
          errorMessage="UCOMPANY_LOGO_ERROR"
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          multiline
          autoCapitalize="sentences"
          errorMessage="UCOMPANY_NAME_ERROR"
          placeholder="UCOMPANY_NAME_PLACE"
          labelCopyID="UCOMPANY_NAME_LABEL"
          onBlur={() => validateSingle("name")}
          isError={!validationStates.name}
          value={name}
          setValue={setName}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          multiline
          autoCapitalize="sentences"
          errorMessage="UCOMPANY_ADDRESS_ERROR"
          placeholder="UCOMPANY_ADDRESS_PLACE"
          labelCopyID="UCOMANY_ADDRESS_LABEL"
          onBlur={() => validateSingle("address")}
          isError={!validationStates.address}
          value={address}
          setValue={setAddress}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="email"
          isError={!validationStates.email}
          onBlur={() => validateSingle("email")}
          errorMessage='UCOMPANY_EMAIL_ERROR'
          placeholder="UCOMPANY_EMAIL_PLACE"
          labelCopyID="UCOMPANY_EMAIL_LABEL"
          value={email}
          setValue={setEmail}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="tel"
          isError={!validationStates.tel}
          onBlur={() => validateSingle("tel")}
          errorMessage='UCOMPANY_PHONE_ERROR'
          placeholder="UCOMPANY_PHONE_PLACE"
          labelCopyID="UCOMPANY_PHONE_LABEL"
          value={tel}
          setValue={setTel}
          style={{ marginVertical: "4%" }}
        />
 
        <PillButton onPress={handleUpdate} isLoading={company.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />

      </KeyboardAwareScrollView>
      

    </ViewLayout>
  )
}

export default UCompanyView;

