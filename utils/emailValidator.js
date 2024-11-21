const emailValidator = (email) => {
    return (email.includes("@gmail.com")) 
            ? true 
            : (email.includes("@yahoo.com")) 
                ? true 
                : (email.includes("@outlook.com")) 
                    ? true 
                    : (email.includes("@icloud.com")) 
                        ? true
                        : false
}
 
export default {emailValidator}