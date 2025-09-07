export enum BadRequestMessage {
    InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمی باشد",
    InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
    EmailFormat = "فرمت ایمیل وارد شده صحیح نمی باشد",
    MobileNumber = "فرمت شماره همراه شما صحیح نمی باشد",
}

export enum AuthMessage {
    NotFoundAccount = "حساب کاربری یافت نشد",
    NotUsername = "برای ثبت نام تنها از ایمیل یا شماره همراه استفاده کنید",
    AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا ثبت شده است",
    UsernameValidation = "یوزرنیم وارد شده صحیح نمی باشد",
    ExistUsername = "یوزرنیم وارد شده تکراری می باشد"
}

export enum NotFoundMessage {}

export enum ValidationMessage {

}

export enum PublicMessage {
    SentOtp = "رمز یکبار مصرف با موفقیت ارسال شد"
}