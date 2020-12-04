import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { BrowserRouter} from "react-router-dom";
import './index.css';
/* to integrate with stored procedures */
import FetchData from "../utils/FetchData";

 
 const MyTextInput = ({ label, ...props }) => {
   // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
   // which we can spread on <input>. We can use field meta to show an error
   // message if the field is invalid and it has been touched (i.e. visited)
   const [field, meta] = useField(props);
   return (
     <>
       <label htmlFor={props.id || props.name}>{label}</label>
       <input className="text-input" {...field} {...props} />
       {meta.touched && meta.error ? (
         <div className="error">{meta.error}</div>
       ) : null}
     </>
   );
 };
 
 const MyCheckbox = ({ children, ...props }) => {
   // React treats radios and checkbox inputs differently other input types, select, and textarea.
   // Formik does this too! When you specify `type` to useField(), it will
   // return the correct bag of props for you
   const [field, meta] = useField({ ...props, type: 'checkbox' });
   return (
     <div>
       <label className="checkbox">
         <input type="checkbox" {...field} {...props} />
         {children}
       </label>
       {meta.touched && meta.error ? (
         <div className="error">{meta.error}</div>
       ) : null}
     </div>
   );
 };

 const MyRadio = ({ children, ...props }) => {
    // React treats radios and checkbox inputs differently other input types, select, and textarea.
    // Formik does this too! When you specify `type` to useField(), it will
    // return the correct bag of props for you
    const [field, meta] = useField({ ...props, type: 'radio' });
    return (
      <div>
        <label className="radio">
          <input type="radio" {...field} {...props} />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    );
  };
 
 const MySelect = ({ label, ...props }) => {
   const [field, meta] = useField(props);
   return (
     <div>
       <label htmlFor={props.id || props.name}>{label}</label>
       <select {...field} {...props} />
       {meta.touched && meta.error ? (
         <div className="error">{meta.error}</div>
       ) : null}
     </div>
   );
 };
 
 async function SubmitData (vals) {
  await FetchData("/InsertStudentInformation", "PUT", vals)
    .then((res) => {
    if (res.status === 200) {
      return res.json();
      //this.props.history.push("/section1");
    } else {
      alert('An error occured adding the information.')
    }
  })
 }

 // And now we can use these
 class SignupForm extends React.Component {
  constructor(props) {
		super();
  }
  state = { 
    showE: false,
    showP: false,
    showH: false
  }

  setShowEthnicity = () => {
    this.setState(prevState => ({
      showE: !prevState.showE
    }))
  }

  setShowPLanguage = () => {
    this.setState(prevState => ({
      showP: !prevState.showP
    }))
  }

  setShowHLanguage = () => {
    this.setState(prevState => ({
      showH: !prevState.showH
    }))
  }

  render () {
      return (
      <>
       <h1>Minimal Sociodemographic Info</h1>
       <Formik
         initialValues={{
           FirstName: '',
           LastName: '',
           //acceptedTerms: false, // added for our checkbox
           Ethnicity: '', // added for our select
         }}
         validationSchema={Yup.object({
           FirstName: Yup.string()
             .max(15, 'Must be 15 characters or less')
             .required('Required'),
           LastName: Yup.string()
             .max(20, 'Must be 20 characters or less')
             .required('Required'),
           Gender: Yup.string()
             .oneOf(
               ['boy', 'girl', 'other'],
               'Invalid selection'
             )
             .required('Required'),
           School: Yup.string()
             .max(100, 'Must be 100 characters or less')
             .required('Required'),
            Grade: Yup.mixed()
             .oneOf(
               ['4', '5', '6', '7', '8', 'other'],
               'Invalid selection'
             )
             .required('Required'),
            Ethnicity:  Yup.array().of( 
              Yup.string().oneOf(
                ['white', 'black', 'latino', 'asian', 'amerindian', 'pacific', 'other'],
                'Invalid racial/ethnic selection')
            )
            .required('Please select at least one racial/ethnic background.'),
            EthnicityOther: Yup.string().when(['Ethnicity'], {
              is: (Ethnicty) => Ethnicty.includes ('other'),
              then: Yup.string().required('Please enter some more information.'),
            })
            .max(50, 'Should be 50 characters or less'),
            PrimaryLanguage:  Yup.array().of( 
                Yup.string().oneOf(
                  ['spanish', 'arabic', 'chinese', 'english', 'other'],
                  'Invalid language selection')
              )
                .required('Please select at least one language.'),
            OtherLanguageHome: Yup.string().when(['PrimaryLanguage'], {
              is: (PrimaryLanguage) => PrimaryLanguage.includes ('other'),
              then: Yup.string().required('Please enter some more information.'),
            })
            .max(50, 'Should be 50 characters or less'),
            languagesHome:  Yup.array().of( 
                  Yup.string().oneOf(
                    ['spanish', 'arabic', 'chinese', 'english', 'other'],
                    'Invalid language selection')
                )
                  .required('Please select at least one language.'),
            OtherLanguagePeople: Yup.string().when(['languagesHome'], {
              is: (languagesHome) => languagesHome.includes ('other'),
              then: Yup.string().required('Please enter some more information.'),
            })
            .max(50, 'Should be 50 characters or less'),
         })}
         onSubmit={(values, { setSubmitting }) => {
           setTimeout(() => {
             alert(JSON.stringify(values, null, 2));
             SubmitData(values);
             //fetchData('/InsertStudentInformation/', 'PUT', values) /*put data to database; will need to get a unique id for next section */
             setSubmitting(false);
           }, 400);
         }}
       >
         <Form>
            <div>
           <MyTextInput
             label="First Name"
             name="FirstName"
             type="text"
             placeholder="Jane"
           /> 
           </div>
           <div>
           <MyTextInput
             label="Last Name"
             name="LastName"
             type="text"
             placeholder="Doe"
           />
           </div>
           <div>
           <label>Gender: </label>
            <MyRadio type="radio" name="Gender" value="boy"> Boy </MyRadio>
            <MyRadio type="radio" name="Gender" value="girl"> Girl </MyRadio>
            <MyRadio type="radio" name="Gender" value="other"> Other </MyRadio>

           </div>
           <div>
           <MyTextInput
             label="What is your school's name?"
             name="School"
             type="text"
             placeholder=""
           />
           </div>
           <div>
           <MySelect label="What grade are you in?" name="Grade">
             <option value="">Select a grade level</option>
             <option value="4">4</option>
             <option value="5">5</option>
             <option value="6">6</option>
             <option value="7">7</option>
             <option value="8">8</option>
             <option value="other">Other</option>
           </MySelect>
           </div>
           
           <div>
           <MyTextInput
             label="What is the name of your homeroom teacher?"
             name="HomeroomTeacher"
             type="text"
             placeholder=""
           />
           </div>
          <div><label htmlFor="Ethnicity">What is your racial/ethnic background (Please check all that apply)?</label>
           <MyCheckbox 
            multiple={true} 
            value="white" 
            name="Ethnicity">White</MyCheckbox>
           <MyCheckbox multiple={true}
            value="black" 
            name="Ethnicity">Black or African American
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="latino" 
            name="Ethnicity">Hispanic or Latino
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="asian" 
            name="Ethnicity">Asian
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="amerindian" 
            name="Ethnicity">American Indian or Alaska Native
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="pacific" 
            name="Ethnicity">Native Hawaiian or Other Pacific Islander
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="other" 
            name="Ethnicity"
            onClick={this.setShowEthnicity}
            >Other            
            </MyCheckbox>
           </div>
           <div id="EthnicityOther" style={{ display: this.state.showE ? "block" : "none" }}> 
           <MyTextInput
             label="Other"
             name="EthnicityOther"
             type="text"
             placeholder=""
           />
           </div>
           <div><label htmlFor="PrimaryLanguage">What language or languages do <strong>you</strong> speak at home (Please check all that apply)? </label>
           <MyCheckbox 
            multiple={true} 
            value="spanish" 
            name="PrimaryLanguage">Spanish</MyCheckbox>
           <MyCheckbox multiple={true} 
            value="arabic" 
            name="PrimaryLanguage">Arabic
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="chinese" 
            name="PrimaryLanguage">Chinese
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="english" 
            name="PrimaryLanguage">English
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="other" 
            name="PrimaryLanguage"
            onClick={this.setShowPLanguage} >Other            
            </MyCheckbox>
           </div>
           <div style={{ display: this.state.showP ? "block" : "none" }}> 
           <MyTextInput
             label="Other"
             name="OtherLanguageHome"
             type="text"
             placeholder=""
           />
           </div>
           <div><label htmlFor="languagesHome">What language or languages do <strong>people in your home</strong> speak (Please check all that apply)?</label>
           <MyCheckbox 
            multiple={true} 
            value="spanish" 
            name="languagesHome">Spanish</MyCheckbox>
           <MyCheckbox multiple={true} 
            value="arabic" 
            name="languagesHome">Arabic
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="chinese" 
            name="languagesHome">Chinese
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="english" 
            name="languagesHome">English
            </MyCheckbox>
            <MyCheckbox multiple={true} 
            value="other" 
            name="languagesHome"
            onClick={this.setShowHLanguage}>Other
            </MyCheckbox>
           </div>
           <div style={{ display: this.state.showH ? "block" : "none" }}> 
           <MyTextInput
             label="Other"
             name="OtherLanguagePeople"
             type="text"
             placeholder=""
           />
           </div>
           <button type="submit">Submit</button>
         </Form>
       </Formik>
     </>
   );
  }
 }
 ReactDOM.render(<SignupForm />, document.getElementById('root'));