function Validator (options) 
{     
      function Validate(rule,inputElement) {
            // value: inputElement.value
            // test function : rule.test()
            const errorMessage = rule.test(inputElement.value);
            const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            if (errorMessage)
            {
                  errorElement.innerText = errorMessage
                  inputElement.parentElement.classList.add('invalid')
            }
            else
            {
                  errorElement.innerText = ''
                  inputElement.parentElement.classList.remove('invalid')
            }
      }

      const formElement = document.querySelector(options.form);

      if (formElement)
      {
            options.rules.forEach((rule) => {
                  const inputElement = formElement.querySelector(rule.selector);
                  
                  // Xử lý khi blur ra ngoài 
                  inputElement.onblur = () =>{
                        Validate(rule,inputElement)
                  }

                  // Xử lý khi đang nhập 
                  inputElement.oninput = () =>{
                        const errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                        errorElement.innerText = ''
                        inputElement.parentElement.classList.remove('invalid')
                  }
            })
      }
}

Validator.isName = (selector) => {
      return {
            selector : selector,
            test: (value) => {
                  return value.trim() ? undefined : 'Vui lòng nhập trường này!'
            }
      }
}

Validator.isEmail = (selector) => {
      return {
            selector : selector,
            test: (value) => {
                  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                  return regex.test(value) ? undefined : 'Vui lòng nhập Email vào đây!'
            }
      }
}

Validator.isPassword = (selector) => {
      return {
            selector: selector,
            test: (value) => {
                  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  return regex.test(value) ? undefined : 'Tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường và một số'
            }
      }
}