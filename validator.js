
// Đối tượng Validator
function Validator(options)
{     
      // lưu tất cả các rule của các selector
      var selectorRules = {}
      // Hàm để kiểm tra lỗi
      function validate (inputElement, rule) {
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            // value: inputElement.value
            // test function : rule.test
            var errorMessage  // = rule.test(inputElement.value);
            
            // Chúng ta sẽ lấy được tất cả các rule khi chọn vào input
            const rules = selectorRules[rule.selector]

            // Lặp qua từng rule và kiểm tra 
            // Nếu có lỗi thì dừng kiểm tra 
            for ( var i = 0; i < rules.length ; i++)
            {
                  // rules[i] giống như rule.test -> nên mở ngoặc để chạy hàm rồi truyền value vào
                  errorMessage = rules[i](inputElement.value)
                  if (errorMessage) break
            }

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

            return !!errorMessage
      }

      // Lấy ra form mong muốn 
      var formElement = document.querySelector(options.form)
      // Kiểm tra xem formElement có tồn tại hay không?
      if (formElement)
      {     
            // Xử lý khi submit form
            formElement.onsubmit = (e) => {
                  e.preventDefault();

                  var isFormError = false;

                  // Lặp qua từng rule và validate luôn
                  options.rules.forEach((rule) => {
                        var inputElement = formElement.querySelector(rule.selector)
                        var isValid = validate(inputElement, rule)
                        if(isValid)
                        {
                              isFormError = true
                        }
                  })

                  if(!isFormError)
                  {
                        if(typeof options.onSubmit === 'function')
                        {
                              var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                              // console.log(enableInputs)
                              // NOTE: Hiện tại enableInputs đang là NodesList nên phải ép kiểu thành array mới dùng phương thức reduce được
                              var formValues = Array.from(enableInputs).reduce((values, input) => {
                                    // 
                                    // NOTE: console.log(values) là giá trị khởi tạo ban đầu, ở đây là 1 objet
                                    // NOTE: console.log(input) là từng phần tử trong enableInputs 
                                    // NOTE: console.log(input.name) thì chẳng khác nào key ( hay còn gọi là selector)
                                    // NOTE: console.log(input.value) thì chẳng khác nào value ( người dùng nhập vào)
            
                                    // NOTE: truyền key vào value vào object
                                    values[input.name] = input.value
            
                                    // Trả về object lưu giá trị
                                    return values 
                              },{}/*Giá trị khởi tạo ban đầu*/)
                              options.onSubmit(formValues)
                        }
                  }

            }

            // Lặp qua các rule và xử lý ( lắng nghe sự kiện blur, input, ...)
            options.rules.forEach((rule) => {

                  var inputElement = formElement.querySelector(rule.selector)

                  // IPT: selectorRules[rule.selector là KEY còn rule.test là VALUE
                  if(Array.isArray(selectorRules[rule.selector]))
                  {
                        // Trong trường hợp là mảng thì sẽ lọt vào đây
                        // Khi là mảng thì chúng ta sẽ push cái rule tiếp theo vào chính các key đó 
                        selectorRules[rule.selector].push(rule.test)
                  }else {
                        // Khi mới chạy thì sẽ không phải là mảng nên sẽ chạy ở đây trước
                        selectorRules[rule.selector] = [rule.test]
                  }

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
Validator.isRequired = (selector, message) => {
      return {
            selector: selector,
            test: (value) => {
                  return value.trim() ? undefined : message || 'Vui lòng nhập trường này!'
            }
      }
}
Validator.isEmail = (selector, message) => {
      return {
            selector: selector,
            test: (value) => {
                  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                  // test() ở đây không phải là hàm trong minLength mà là hàm được định nghĩa sẵn "https://www.w3schools.com/jsref/jsref_regexp_test.asp"
                  return regex.test(value) ? undefined : message || 'Vui lòng nhập trường này!'
            }
      } 
}

Validator.minLength = (selector, message) => {
      return {
            selector: selector,
            test: (value, min) => {
                  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  // test() ở đây không phải là hàm trong minLength mà là hàm được định nghĩa sẵn "https://www.w3schools.com/jsref/jsref_regexp_test.asp"
                  return regex.test(value) ? undefined : message || 'Tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường và một số'
            }
      } 
}

Validator.isConfirmed = (selector, getConfirmed, message) => {
      return {
            selector:selector, 
            test: (value) =>
            {
                  return value === getConfirmed() ? undefined : message || 'Không khớp!'
            }
      }
}
