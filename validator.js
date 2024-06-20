// ERROR: trong trường hợp thẻ input có quá nhiều thành phần cha sẽ gây ra bug 
      // - tạo ra 1 hàm getParent để lặp qua tất cả các thành phần cha, hàm nào đúng thì trả về hàm đó
// ERROR: trong trường hợp thẻ input có type bằng radio thì value luôn được trả về và tạo ra bug 
      // - Chúng ta vào hàm validate để thêm switch case, chỉ khi nào inputElement có type bằng checkbox hoặc radio thì mới giải quyết, còn lại thì chạy như thường
            // Khi vào case checkbox hoặc radio thì chúng ta mong muốn chỉ lấy ra nhưng cái nào được checked thôi
                  // sau khi giải quyết sẽ có 1 bug là phương thức trim() ở rule isRequired  - cách giải quyết là bỏ trim() đi 
                  // bug tiếp theo là khi không checked và submit, chỉ có thằng đầu tiên khi check thì mới hết báo lỗi, còn 2 thằng ở dưới thì không tự hết báo lỗi - fix ở inputElement, vì khi dùng type là checkbox hay radio thì sẽ có nhiều thằng trùng cái selector. Chúng ta chuyển querySelector thành querySelectorAll, sau đó lặp qua để lấy tất cả các thằng inputElement 
            // Khi submit ra thì kết quả chỉ trả về là other 
                  // Di chuyển đến submit với js và thêm 1 switch case vào. 
                        // Trong trường hợp input.type là radio - chúng ta sẽ chọn ra cái thẻ đang được checked
                        // Trong trường hợp input.type là checkbox 
                              // Mong muốn nhận 1 array, trong array đó có tất cả các value mà người dùng check, còn tron trường hợp không check thì trả về 1 array trống
                        // Trong trường hợp là file
                              // Mong muốn là trả về 1 fileList 

// Đối tượng Validator
function Validator(options)
{     
      // lưu tất cả các rule của các selector
      var selectorRules = {}

      // hàm lấy ra parentElement 
      function getParent(element, selector) {
            while (element.parentElement)
            {
                  if(element.parentElement.matches(selector))
                  {
                        return element.parentElement
                  }
                  element = element.parentElement
            }
      }

      // Hàm để kiểm tra lỗi
      function validate (inputElement, rule) {
            var errorElement = getParent(inputElement, options.formSelector).querySelector(options.errorSelector)
            // value: inputElement.value
            // test function : rule.test
            var errorMessage  // = rule.test(inputElement.value);
            
            // Chúng ta sẽ lấy được tất cả các rule khi chọn vào input
            const rules = selectorRules[rule.selector]

            // Lặp qua từng rule và kiểm tra 
            // Nếu có lỗi thì dừng kiểm tra 
            for ( var i = 0; i < rules.length ; i++)
            {
                  switch(inputElement.type)
                  {
                        case 'radio':
                        case 'checkbox':
                              // trong trường hợp là checkbox, radio
                              errorMessage = rules[i](
                                    // chúng ta lấy từ formElement sau đó chọn ra selector nào của checkbox hay radio được checked
                                    formElement.querySelector(rule.selector + ':checked')
                              )
                              break;
                        default:
                              // rules[i] giống như rule.test -> nên mở ngoặc để chạy hàm rồi truyền value vào
                              errorMessage = rules[i](inputElement.value)
                  }
                  if (errorMessage) break
            }

            // Trong trường hợp lả có lỗi
            if (errorMessage)
            {
                  errorElement.innerText = errorMessage
                  getParent(inputElement, options.formSelector).classList.add('invalid')
            }
            else
            {
                  errorElement.innerText = ''
                  getParent(inputElement, options.formSelector).classList.remove('invalid')
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
                        // Submit với js 
                        if(typeof options.onSubmit === 'function')
                        {
                              var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                              // console.log(enableInputs)
                              // NOTE: Hiện tại enableInputs đang là NodesList nên phải ép kiểu thành array mới dùng phương thức reduce được
                              var formValues = Array.from(enableInputs).reduce((values, input) => {
                                    // NOTE: console.log(values) là giá trị khởi tạo ban đầu, ở đây là 1 objet
                                    // NOTE: console.log(input) là từng phần tử trong enableInputs 
                                    // NOTE: console.log(input.name) thì chẳng khác nào key ( hay còn gọi là selector)
                                    // NOTE: console.log(input.value) thì chẳng khác nào value ( người dùng nhập vào)
            
                                    switch(input.type)
                                    {
                                          case 'radio' :
                                                values[input.name] = formElement.querySelector('input[name ="'+input.name+'"]:checked').value;
                                                break
                                          case 'checkbox' :
                                                if(input.matches(':checked'))
                                                {
                                                      if(!Array.isArray(values[input.name]))
                                                      {
                                                            values[input.name] = []
                                                      }
                                                      values[input.name].push(input.value)
                                                }
                                                else
                                                {
                                                      values[input.name] = ''
                                                      return values
                                                }
                                                break
                                          case 'file' : 
                                                values[input.name] = input.files
                                                break
                                          default:
                                                // NOTE: truyền key vào value vào object
                                                values[input.name] = input.value
                                    }
                                    // Trả về object lưu giá trị
                                    return values 
                              },{}/*Giá trị khởi tạo ban đầu*/)
                              options.onSubmit(formValues)
                        }
                        else {
                              formElement.submit()
                        }
                  }
            }

            // Lặp qua các rule và xử lý ( lắng nghe sự kiện blur, input, ...)
            options.rules.forEach((rule) => {

                  var inputElements = formElement.querySelectorAll(rule.selector)

                  Array.from(inputElements).forEach((inputElement) => {
                        if(inputElement)
                        {
                              // Xử lý khi người dùng blur ra ngoài
                              inputElement.onblur = () => {
                                    validate(inputElement, rule)
                              }
      
                              // Xử lý khi người dùng đang nhập
                              inputElement.oninput = () =>{ 
                                    var errorElement = getParent(inputElement, options.formSelector).querySelector(options.errorSelector)
                                    errorElement.innerText = ''
                                    getParent(inputElement, options.formSelector).classList.remove('invalid')
                              }
                        }
                  })

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
                  return value ? undefined : message || 'Vui lòng nhập trường này!'
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
