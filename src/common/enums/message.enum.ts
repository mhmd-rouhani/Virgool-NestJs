export enum BadRequestMessage {
    InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمی باشد",
    InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
    EmailFormat = "فرمت ایمیل وارد شده صحیح نمی باشد",
    MobileNumber = "فرمت شماره همراه شما صحیح نمی باشد",
    InvalidImageFormat = "فرمت تصاویر انتخاب شده صحیح نمی باشد",
    SomethingWrong = "خطایی پیش آمده دوباره تلاش کنید",
    InvalidCategories = "دسته بندی ها رو به درستی وارد کنید"
}

export enum AuthMessage {
    NotFoundAccount = "حساب کاربری یافت نشد",
    NotUsername = "برای ثبت نام تنها از ایمیل یا شماره همراه استفاده کنید",
    AlreadyExistAccount = "حساب کاربری با این مشخصات قبلا ثبت شده است",
    UsernameValidation = "یوزرنیم وارد شده صحیح نمی باشد",
    ExistUsername = "یوزرنیم وارد شده تکراری می باشد",
    ExpiredCode = "کد تایید منقضی شده مجددا تلاش کنید",
    TryAgain = "مجددا تلاش کنید",
    LoginAgain = "مجددا وارد حساب کاربری خود شوید",
    LoginIsRequired = "وارد حساب کاربری خود شوید"
}

export enum NotFoundMessage {
    NotFound = "موردی یافت نشد",
    NotFoundCategory = "دسته بندی یافت نشد",
    NotFoundPost = "مقاله یافت نشد",
    NotFoundUser = "کاربری یافت نشد",
}

export enum ValidationMessage {
    InvalidEmailFormat = "ایمیل وارد شده صحیح نمی باشد",
    InvalidPhoneFormat = "شماره موبایل وارد شده صحیح نمی باشد",
}

export enum PublicMessage {
    SentOtp = "رمز یکبار مصرف با موفقیت ارسال شد",
    LoggedIn = "با موفقیت وارد حساب کاربری خود شدید",
    Created = "با موفقیت ایجاد شد",
    Deleted = "با موفقیت حذف شد",
    Updated = "با موفقیت بروز شد",
    Like = "مقاله با موفقیت لایک شد",
    DisLike = "لایک شما از مقاله برداشته شد",
    Bookmark = "مقاله با موفقیت بوکمارک شد",
    DisBookmark = "بوکمارک شما از مقاله برداشته شد",
    CreatedComment = "نظرشما با موفقیت ثبت شد"
}

export enum ConflictMessage {
    CategoryTitle = "عنوان دسته بندی قبلا ثبت شده است",
    BlogTitle = "عنوان بلاگ قبلا ثبت شده است",
    Email = "ایمیل توسط شخص دیگری استفاده شده",
    Phone = "شماره موبایل توسط شخص دیگری استفاده شده",
    Username = "نام کاربری توسط شخص دیگری استفاده شده",
}