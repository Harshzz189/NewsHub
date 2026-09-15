import { useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { submitPreferences } from "../Redux/Slice";
import { hindiTranslations } from "../Data/Languageguid";
import './profile.css'

export function Profilepage() {
  const [changes, setChanges] = useState(false);
  const [field, setField] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentuser = useSelector((state) => state.users.currentUser);
  const language = useSelector((state) => state.users.currentUser.language);

  const initialValues = {
    country: currentuser.country,
    preferences: currentuser.preferences.map((cat) => cat.category.type),
    language: currentuser.language,
  };

  const validationSchema = yup.object({
    preferences: yup
      .array()
      .min(3, "At least 3 required")
      .max(5, "At most 5 allowed"),
    language: yup
      .array()
      .min(1, "Select an Option")
      .max(1, "Only one is Allowed"),
    country: yup.string().required("Enter the country"),
  });

  function onSubmit(values) {
    dispatch(
      submitPreferences({
        country: values.country,
        preferences: values.preferences,
        language: values.language,
      })
    );
    navigate("/profile");
    setField(null);
    setChanges(false);
  }

  const validate = (values) => {
    const error = {};

    if (field === "Country" && values.country === initialValues.country) {
      error.country = "Enter Different Country";
    }

    if (
      field === "Language" &&
      values.language[0] === initialValues.language[0]
    ) {
      error.language = "Choose another option";
    }

    if (
      field === "Preferences" &&
      JSON.stringify([...values.preferences].sort()) ===
        JSON.stringify([...initialValues.preferences].sort())
    ) {
      error.preferences = "Choose Different Set of Prefernces";
    }

    return error;
  };

 return (
  <div className="profilepage-main-container"
  >
   <div className="leftside-container">
  {changes ? (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validate={validate}
    >
      <Form className="user-form-profile">
        <Outlet />

        <button className="submit-button" type="submit">
          {language[0] === "eg"
            ? "Save Preferences"
            : hindiTranslations["save preferences"]}
        </button>
      </Form>
    </Formik>
  ) : (
    <div className="default-data-container">

      <div className="settings-icon"><i class="fa-solid fa-house"></i></div>

      <h2 className="settings-header">
        {language[0] === "eg"
          ? "Profile Settings"
          : "प्रोफ़ाइल सेटिंग्स"}
      </h2>

      <p className="defaulter">
        {language[0] === "eg"
          ? "Select an option from the right panel to update your profile."
          : "अपनी प्रोफ़ाइल अपडेट करने के लिए दाईं ओर से विकल्प चुनें।"}
      </p>

      <div className="profile-tips">

        <h4>
          {language[0] === "eg"
            ? "Quick Tips"
            : "त्वरित सुझाव"}
        </h4>

        <ul>
          <li>
            {language[0] === "eg"
              ? "Personalize your news feed with your favorite categories."
              : "अपनी पसंदीदा श्रेणियों से अपना समाचार फ़ीड व्यक्तिगत बनाएँ।"}
          </li>

          <li>
            {language[0] === "eg"
              ? "Choose your preferred country and language."
              : "अपना पसंदीदा देश और भाषा चुनें।"}
          </li>

          <li>
            {language[0] === "eg"
              ? "Your changes are saved securely."
              : "आपके परिवर्तन सुरक्षित रूप से सहेजे जाते हैं।"}
          </li>
        </ul>

      </div>

    </div>
  )}
</div>
 <div className="right-side-container">

  <h2 className="profile-title">
    <i class="fa-solid fa-user"></i> {language[0] === "eg" ? "Profile" : "प्रोफ़ाइल"}
  </h2>

  <section className="profile-section">

    <h3 className="section-title">
      {language[0] === "eg"
        ? "Account"
        : "खाता जानकारी"}
    </h3>

    <div className="info-item">
      <strong> {language[0] === "eg" ? "UserName" : "ईमेल"}</strong>
      <p>{currentuser.id}</p>
    </div>

    <div className="info-item">
      <strong ><i class="fa-solid fa-globe"></i>{language[0] === "eg" ? "Country" : "देश"}</strong>
      <p>{currentuser.country}</p>
    </div>

    <div className="info-item">
      <strong><i class="fa-solid fa-language"></i> {language[0] === "eg" ? "Language" : "भाषा"}</strong>
      <p>{language[0]}</p>
    </div>

  </section>

  <section className="profile-section">

    <h3 className="section-title">
      {language[0] === "eg"
        ? "Preferences"
        : "समाचार प्राथमिकताएँ"}
    </h3>

    <div className="prefernces-div">
      {currentuser.preferences.map((pref) => (
        <span
          key={pref.category.type}
          className="user-preferences"
        >
          {language[0] === "eg"
            ? pref.category.type
            : hindiTranslations[pref.category.type]}
        </span>
      ))}
    </div>

  </section>


  <section className="profile-section">

    <h3 className="section-title">
      {language[0] === "eg"
        ? "Manage Account"
        : "खाता प्रबंधित करें"}
    </h3>

    <button
      className="change-button"
      onClick={() => {
        setChanges(true);
        setField("Country");
        navigate("changecountry");
      }}
    >
      <i class="fa-solid fa-globe"></i> {language[0] === "eg"
        ? "Country"
        : hindiTranslations["change country"]}
    </button>

    <button
      className="change-button"
      onClick={() => {
        setChanges(true);
        setField("Language");
        navigate("changelang");
      }}
    >
       <i class="fa-solid fa-language"></i>{language[0] === "eg"
        ? "Language"
        : hindiTranslations["change language"]}
    </button>

    <button
      className="change-button"
      onClick={() => {
        setChanges(true);
        setField("Preferences");
        navigate("changeprefs");
      }}
    >
      <i class="fa-solid fa-sliders"></i> {language[0] === "eg"
        ? "Preferences"
        : hindiTranslations["change preferences"]}
    </button>

    <button className="change-button">
      <i class="fa-solid fa-key"></i> {language[0] === "eg"
        ? "Password"
        : hindiTranslations["change password"]}
    </button>

  </section>


  <section className="profile-section logout-section">

    <button className="logout-button">
      <i class="fa-solid fa-right-from-bracket"></i> {language[0] === "eg"
        ? "Logout"
        : hindiTranslations["logout"]}
    </button>

  </section>

</div>
  </div>
);
}