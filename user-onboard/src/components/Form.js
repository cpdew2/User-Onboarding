import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const Form = () => {
    const [post, setPost] = useState([]);
    const initialState = {
        name: "",
        email: "",
        password: "",
        goals: "",
        role: "",
        terms: "",
     };

    const [errors, setErrors] = useState(initialState);
    const [buttonDisabled, setButtonDisabled] =
        useState(true);
    const [formState, setFormState] = useState(initialState);
    
    let formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field!"),
        email: yup.string().email().required("Email is a required field!"),
        password: yup.string().required("Password is a required field!"),
        goals: yup.string().required("Desire for success!"),
        role: yup.string(),
        terms: yup.bool().oneOf([true], "Terms must be excepted..."),

});
const formSubmit = (e) => {
    e.preventDefault();
    axios
        .post("https://reqres.in/api/users", formState)
        .then((response) => {
            setPost(response.data);
            setFormState(initialState);

        })
        .catch((err) => console.log(err.response));
};

useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
        console.log(formState);
        console.log('valid? ', valid);
        setButtonDisabled(!valid);
    }, [formSchema]);
});

//console.log("error state: ", errors);
    const validateChange = (e) => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then((valid) => {
            setErrors({ 
                ...errors, 
                [e.target.name]: "",
            });
        })
        .catch((err) => {
            console.log(err);
            setErrors({ 
                ...errors, 
                [e.target.name]: err.errors[0],
            });
        });
    };

    const inputChange = (e) => {
        e.persist();
        const newFormData = {
            ...formState,
            [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked :
        e.target.value,

        };
        validateChange(e);
        setFormState(newFormData);
    };

    return (
        <form
        onSubmit={formSubmit}>
             <label htmlFor="name">
            Name
            <input
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange}
            />
        {errors.name.length > 0 ? <p className="error">
            {errors.name}</p> : null}
        </label>
        <label htmlFor="email">
            Email
            <input 
            type="email"
            name="email"
            value={formState.email}
            onChange={inputChange}
            />
           {errors.email.length > 0? <p className="error">
            {errors.email}</p> : null}  
        </label>
        <label htmlFor="name">
            Password
            <input 
            type="password"
            name="password"
            value={formState.password}
            onChange={inputChange}
            />
           {errors.password.length > 0? <p className="error">
            {errors.password}</p> : null}
        </label>
            <label htmlFor="goals">
            What are your career goals?
            <textarea name="goals" 
            value={formState.goals}
            onChange={inputChange}
            />
            {errors.goals.length > 0? <p className="error">
            {errors.goals}</p> : null}
        </label>
            <label htmlFor="role">
            What role do you currently hold?
            <select id="role" name="role" onChange={inputChange}>
                <option value="engineer">Engineer</option>
                <option value="qa-analyst">QA-Analyst</option>
                <option value="manager">Manager</option>
                <option value="team-lead">Team-Lead</option>
            </select>
        </label>
        <label htmlFor="terms">
            <input
            type="checkbox"
            name="terms"
            checked={formState.terms}
            onChange={inputChange}
            />
            Terms & Conditions
            </label>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={buttonDisabled}>
                Submit
            </button>
            </form>
         
    );
};
export default Form;