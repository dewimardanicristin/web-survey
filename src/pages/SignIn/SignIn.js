import React, { useContext, useState } from "react";
import { Container, Buttons, Card, ErrorMessage,InputColor } from "./styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import SizedBox from "../../components/SizedBox";
import VectorContainer from "../../components/VectorContainer";
import signin_vector from "../../assets/img/flame-sign-up.png";
import AuthContext from "../../contexts/auth";
import axiosInstance from "../../services/api";
import { URL_ROOT, URL_REGISTER } from "../../utils/constants";

export default function SignIn({ history }) {
  const { setUser, user } = useContext(AuthContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/users/auth", {
        email,
        password
      });

      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${response.data.token}`
      };

      const userData = {
        ...user,
        isLoggedIn: true,
        data: response.data.user,
        token: response.data.token
      };

      setUser(userData);

      localStorage.setItem("user", JSON.stringify(userData));

      history.push(URL_ROOT);
    } catch ({ response }) {
      setError(response?.data?.message || "Unexpected error");
    }
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      login(email, password);
    }
  };

  return (
    <Container Fluid>
      <VectorContainer src={signin_vector}></VectorContainer>
      <Card style={{backgroundColor:"#92ACCE"}}>
        <form className="col s12" onSubmit={() => login(email, password)}>
        <InputColor>
          <Input style={{borderColor:"#FFFFFF"}}
            id="email"
            name="email"
            icon="mail_outline"
            type="email"
            placeholder="Email" 
            value={email}
            onChange={e => setError() || setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
           ></Input>
          </InputColor>  
          <InputColor> 
          <Input style={{borderColor:"#FFFFFF", color:"#FFFFFF"}} 
            id="password"
            name="password"
            icon="lock_outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setError() || setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          ></Input>
           </InputColor> 
        </form>
        <ErrorMessage>{error}</ErrorMessage>
        <SizedBox height="20px" />
        <Buttons>
          <Button onClick={() => login(email, password)}>Sign In</Button>
          <SizedBox height="20px" />
          <Button onClick={() => history.push(URL_REGISTER)} style={{color:"grey"}}color="purple">
            Create Account
          </Button>
        </Buttons>
      </Card>
    </Container >
  );
}
