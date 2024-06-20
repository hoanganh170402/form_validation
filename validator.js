// ERROR: trong trường hợp thẻ input có quá nhiều thành phần cha sẽ gây ra bug 
      // - tạo ra 1 hàm getParent để lặp qua tất cả các thành phần cha, hàm nào đúng thì trả về hàm đó
// ERROR: trong trường hợp thẻ input có type bằng radio thì value luôn được trả về và tạo ra bug
      // - tạo switch case ở hàm validate 
            // - chia ra xem inputElement có type là gì và giải quyết 
      // - Khi check thì chỉ thằng đầu tiên mới hết lỗi, còn check các thằng tiếp theo vẫn lổi 
            // - do thằng inputElement nó  chỉ lấy có 1 selector, thay vào đó thì chuyển thành querySelectorAll và lặp qua để lấy tất cả các inputElement
      // Khi submit thì dữ liệu của gender trả về không đúng
            // Ở formValues lặp qua từng phần tử 1, nên thành ra kết quả của gender luôn trả về là other - tạo switch case để lấy ra các trường hợp 
                  // Trong trường hợp input là checkbox
                  // Trong trường hợp input là radio
                  // Trong trường hợp input là file

function Validator (options) 
{     
      // Điều mong muốn là : 1 selector có nhiều rule
      // Tạo ra 1 object để chứa các selector và tất cả các rule của selector đó
      // Ở đoạn lặp forEach lặp tất cả các key là rule vào selectorRules
            // Phải chuyển tất cả các rule vào trong một array thì mới có thể lấy tất cả các rule trong selector 
      // Sau khi ta có key và tất cả các rule trong selectorRules thì ta vào hàm Validate
            // tạo biến rules để hiển thị tất cả các rule của selector
            // Chúng ta cần lặp qua từng rule, và nếu bị lỗi thì sẽ dừng lại và hiển thị lỗi của rule đó 
            // IPT: rules[i] không khác gì rule.test, cứ mở ngoặc để truyền value vào
      // Giờ muốn onSubmit 
            // Trước tiên thì cần loại bỏ onsubmit mặc định
            // Kiểm tra xem, nếu có lỗi thì phải validate ngay
                  // Làm sao để kiểm tra xem, nếu chỉ có 1 lỗi cũng sẽ validate 
            // Trong trường hợp không có lỗi thì hiển thị tất cả các value người dùng đã nhập vào
                  // Đầu tiên là lặp qua tất cả các input trong form 
                  // chuyển NodeList thành 1 array để dùng phương thức reduce để trả về 1 kết quả

      const selectorRules = {}

      function getParent(input, selector) {
            while(input.parentElement)
            {
                  // TIPS: Phương thức matches trong JavaScript là một phương thức của đối tượng Element. Nó được sử dụng để kiểm tra xem phần tử hiện tại có khớp với một selector CSS cụ thể hay không.
                  if(input.parentElement.matches(selector))
                  {
                        // console.log(input.parentElement);
                        return input.parentElement
                  }
                  input = input.parentElement
            }
      }

      function Validate(rule,inputElement) {
            const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
            // value: inputElement.value
            // test function : rule.test()
            var errorMessage // = rule.test(inputElement.value);

            const rules = selectorRules[rule.selector]

            for(var i = 0; i < rules.length; i++)
            {
                  switch(inputElement.type)
                  {
                        case 'radio':
                        case 'checkbox':
                              errorMessage = rules[i](
                                    formElement.querySelector(rule.selector + ':checked')
                              )
                              break;
                        default :
                        errorMessage = rules[i](inputElement.value)
                  }
                  // Nếu có lỗi thì break và hiển thị lỗi đó và không lặp qua rule kế tiếp
                  if(errorMessage) break
            }

            if (errorMessage)
            {
                  errorElement.innerText = errorMessage
                  getParent(inputElement, options.formGroupSelector).classList.add('invalid')
            }
            else
            {
                  errorElement.innerText = ''
                  getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            }

            // Nếu có lỗi thì sẽ trả về true, không có lỗi thì là false
            // console.log(!!errorMessage)
            return !!errorMessage
      }

      const formElement = document.querySelector(options.form);

      if (formElement)
      {
            formElement.onsubmit = (e) => {
                  // Bỏ đi trạng thái mặc định của onsubmit
                  e.preventDefault()

                  var formError = false

                  // Mong muốn là khi submit, nếu có error là báo
                  options.rules.forEach((rule) => {
                        const inputElement = formElement.querySelector(rule.selector);
                        var isValid = Validate(rule,inputElement)
                        if(isValid)
                        {
                              formError = true
                        }
                  })

                  if(!formError)
                  {
                        if(typeof options.onSubmit === 'function')
                        {
                              // Lặp qua tất cả các input trong fromElement và được trả về 1 NodeList
                              var enableInputs = formElement.querySelectorAll('[name]:not([disabled]')

                              // chuyển NodeList thành 1 array để dùng phương thức reduce để trả về 1 kết quả
                              const formValues = Array.from(enableInputs).reduce((values, input) => {
                                    // NOTE: console.log(values) -> giá trị khởi tạo ban đầu
                                    // NOTE: console.log(input) là từng phần tử trong enableInputs 
                                    // NOTE: console.log(input.name) thì chẳng khác nào key ( hay còn gọi là selector)
                                    // NOTE: console.log(input.value) thì chẳng khác nào value ( người dùng nhập vào)

                                    switch(input.type)
                                    {
                                          case 'checkbox':
                                                if(!Array.isArray(values[input.name]))
                                                {
                                                      values[input.name] = []
                                                }

                                                if(input.checked)
                                                {
                                                      values[input.name].push(input.value)
                                                }
                                                break

                                          case 'radio':
                                                if(input.checked)
                                                {
                                                      values[input.name] = input.value
                                                }
                                                break

                                          case 'file':
                                                values[input.name] = input.files
                                                break

                                          default:
                                                // NOTE: truyền key vào value vào object
                                                values[input.name] = input.value
                                    }
                                    // Trả về object lưu giá trị
                                    return values
                              }, {} /* Giá trị khởi tạo ban đầu */)

                              options.onSubmit(formValues)
                        }
                        else
                        {
                              formElement.submit()
                        }
                  }
            }


            
            options.rules.forEach((rule) => {
                  const inputElements = formElement.querySelectorAll(rule.selector);

                  Array.from(inputElements).forEach((inputElement) => {
                        // Xử lý khi blur ra ngoài 
                        inputElement.onblur = () =>{
                              Validate(rule,inputElement)
                        }

                        // Xử lý khi đang nhập 
                        inputElement.oninput = () =>{
                              const errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                              errorElement.innerText = ''
                              getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                        }
                  })

                  // Khi mới đầu vào thì selectorRules[rule.selector] chưa phải là array nên là phải chạy ở else trước
                  if(Array.isArray(selectorRules[rule.selector]))
                  {
                        // sau khi được gán vào array thì điều kiện if được thoả mãn
                        // Ta push những rule còn thiếu vào trong selector
                        selectorRules[rule.selector].push(rule.test)
                  }else {
                        // Khi vào đây ta sẽ chuyển rule vào array
                        selectorRules[rule.selector]  = [rule.test]
                  }
            })
      }
}

Validator.isRequired = (selector, message) => {
      return {
            selector : selector,
            test: (value) => {
                  return value ? undefined : message || 'Vui lòng nhập trường này!'
            }
      }
}

Validator.isEmail = (selector, message) => {
      return {
            selector : selector,
            test: (value) => {
                  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                  return regex.test(value) ? undefined : message || 'Vui lòng nhập Email vào đây!'
            }
      }
}

Validator.isPassword = (selector, message) => {
      return {
            selector: selector,
            test: (value) => {
                  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                  return regex.test(value) ? undefined : message || 'Tối thiểu tám ký tự, ít nhất một chữ hoa, một chữ thường và một số'
            }
      }
}

Validator.isConfirmed = (selector,getConfirm ,message) => {
      return {
            selector:selector,
            test: (value)=> {
                  return value === getConfirm() ? undefined : message || ' Không khớp!'
            }
      }
}