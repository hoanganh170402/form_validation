
// Đối tượng Validator
function Validator(options)
{     
      // Hàm để kiểm tra lỗi
      function validate (inputElement, rule) {
            console.log(options.errorElement);
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            // value: inputElement.value
            // test function : rule.test
            var errorMessage = rule.test(inputElement.value);

            // Trong trường hợp lả có lỗi
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

      // Lấy ra form mong muốn 
      var formElement = document.querySelector(options.form)
      // Kiểm tra xem formElement có tồn tại hay không?
      if (formElement)
      {     
            options.rules.forEach((rule) => {
                  var inputElement = formElement.querySelector(rule.selector)
                  if(inputElement)
                  {
                        // Xử lý khi người dùng blur ra ngoài
                        inputElement.onblur = () => {
                              validate(inputElement, rule)
                        }

                        // Xử lý khi người dùng đang nhập
                        inputElement.oninput = () =>{ 
                              var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                              errorElement.innerText = ''
                              inputElement.parentElement.classList.remove('invalid')
                        }
                  }
            })
      }
}

// NOTE: Định nghĩa các rules

// IPT: Nguyên tắc của các rules
// 1. Khi có lỗi thì thông báo lỗi
// 2. Khi không có lỗi thì undefined
Validator.isRequired = (selector) => {
      return {
            selector: selector,
            test: (value) => {
                  return value.trim() ? undefined : 'Vui lòng nhập trường này!'
            }
      }
}
Validator.isEmail = (selector) => {
      return {
            selector: selector,
            test: (value) => {
                  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                  // test() ở đây không phải là hàm trong minLength mà là hàm được định nghĩa sẵn "https://www.w3schools.com/jsref/jsref_regexp_test.asp"
                  return regex.test(value) ? undefined : 'Vui lòng nhập trường này!'
            }
      } 
}

Validator.minLength = (selector) => {
      return {
            selector: selector,
            test: (value, min) => {
                  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  // test() ở đây không phải là hàm trong minLength mà là hàm được định nghĩa sẵn "https://www.w3schools.com/jsref/jsref_regexp_test.asp"
                  return regex.test(value) ? undefined : 'Tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường và một số'
            }
      } 
}