export interface User {
    user: string,
    displayName: string,
    token: string,
    image?: string
}
export interface UserLoginFormValue {
    password: string,
    username: string,
}
export interface UserRegisterFormValue {
    email: string,
    password: string,
    confirmPassword: string,
    username: string,
    displayName?: string
}