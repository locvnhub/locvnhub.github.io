console.log('DEBUG LOAD')
if(location.pathname == '/AdJust/CreateAdJustInvWithToken'){
    $('#VATRateItem').val($('#VATRate').val() ) 
}

function checkINFO(){
    console.log('INV_TYPE = ' + $('#INV_TYPE').val())
    console.log('TYPE = ' + $('#type').val())
}

checkINFO()

//--- /Validate Check Mã số thuế
this.submit = function () {
    checkINFO()
    var olMount = $('#OldAmount').val().FormatNumUK()
    var newAmount =  $('#Amount').val().FormatNumUK()
    var newTotla = olMount + newAmount

    var confimOK = confirm("Bạn đang chắc chắc thực hiện điều chỉnh hóa đơn với tổng tiền 2 tờ như sau  : "+ olMount +' + '+ newAmount + ' = '+newTotla )
        if(!confimOK){
            return
        }
        
  var VNPT_localization = localStorage.getItem("VNPT_localization"); 

    var check = 0;
    $("#VatAmount0").val("0");
    $("#VatAmount5").val("0");
    $("#VatAmount10").val("0");
    $("#GrossValue").val("0");
    $("#GrossValue0").val("0");
    $("#GrossValue5").val("0");
    $("#GrossValue10").val("0");
    $("#GrossValueNonTax").val("0");
    $("#VATAMOUNTOTHER").val("0");
    $("#GROSSVALUEOTHER").val("0");

    $("#VatAmount8").val("0");
    $("#GrossValue8").val("0");

    var _totalamount =$("#Total").val().FormatNumUK() ;
    var _vatamount = $("#VATAmount").val().FormatNumUK() ;
    var _vatrate = $("#VATRateItem").val().toFloat() ;
    if (_vatrate > 0) {
        if (_vatrate == 10) {
            $("#VatAmount10").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue10").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
        if (_vatrate == 5) {
            $("#VatAmount5").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue5").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }

        if (_vatrate == 8) {
            $("#VatAmount8").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue8").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
    }
    else if (_vatrate == -99) {
        if ($('#VATRateF').val() == "" || $('#VATRateF').val() == null) {
            var msg_EnterVATRateF = "Cần nhập thuế suất!";
            if (VNPT_localization === "en") {
                msg_EnterVATRateF = "Need To Enter VATRate!";
            }
            alert(msg_EnterVATRateF);
            return false;
        }
        $("#VATAMOUNTOTHER").val(_vatamount.toString().replaceAll(".", ","));
        $("#GROSSVALUEOTHER").val(_totalamount.toString().replaceAll(".", ","));
        $("#VATRate").val($('#VATRateF').val());
    }
    else {
        if (_vatrate == -1) {
            $("#GrossValue").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        };
        if (_vatrate == 0) {
            $("#VatAmount0").val("0");
            $("#GrossValue0").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        };
        if (_vatrate == -2) {
            $("#GrossValueNonTax").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        };
    }
    //var _valid = $(this).parents("form:first").valid();
    //if (!_valid) {
    //    return false
    //}

    if ($("#errorTaxCode").length > 0) {
        $("#errorTaxCode").show();
        $("#CusTaxCode").addClass("error");
        var msg_CusTaxCodeError = 'Xin lỗi, mã số thuế của khách hàng không chuẩn.\n- Bạn có muốn tiếp tục lưu hóa đơn không?';
        if (VNPT_localization === "en") {
            msg_CusTaxCodeError = "Sorry, The Customer's Tax Code Is Not Correct. \n- Do You Want To Continue To Save The Invoice?";
        }
        if (!confirm(msg_CusTaxCodeError)) {
            return false;
        }
    }

    if ( $("#Total").val().indexOf("-") >= 0 
        && $('#INV_TYPE').val() != "3"
        && location.pathname != '/AdJust/CreateAdJustInvWithToken'
       ) {
        var msg_TotalAmountNegative = "Xin lỗi, hóa đơn có giá trị âm [Tổng tiền hóa đơn], chưa thể phát sinh giao dịch.";
        if (VNPT_localization === "en") {
            msg_TotalAmountNegative = "Sorry, The Invoice Has A Negative Value [amount Invoice], No Transactions Yet.";
        }
        alert(msg_TotalAmountNegative);
        return false;
    }

    if ($('#Total').val().FormatNumUK() >= 20000000 && $('#PaymentMethod').val() != 'CK') {
        var mesageconfirm = "Số tiền quá lớn, bạn nên thanh toán chuyển khoản.\n- Bạn có muốn tiếp tục lưu hóa đơn không?";
        if (VNPT_localization === "en") {
            mesageconfirm = "The Amount Is Too Large, You Should Pay For The Transfer. \n- Do You Want To Continue To Save The Invoice?";
        }

        if (!confirm(mesageconfirm)) {
            return false;
        }
    }

    var type = $('#INV_TYPE').val();
    var amount = $('#Amount').val().FormatNumUK();
    var oldAmount = $('#OldAmount').val();
    if ("3" == type && oldAmount > 0) {
        oldAmount = oldAmount.FormatNumUK();
        if (amount >= oldAmount) {
            var mesageconfirm = "Bạn đang lập hóa đơn điều chỉnh giảm quá 100% chi tiết hàng hóa trong hóa đơn gốc.\n- Bạn có muốn tiếp tục lưu hóa đơn không?";
            //if (VNPT_localization === "en") {
            //    mesageconfirm = "You Are Making An Adjustment Invoice That Reduces More Than 100% Of The Goods Details In The Original Invoice. \n- Do You Want To Continue To Save The Invoice?";
            //}

            if (!confirm(mesageconfirm)) {
                return false;
            }
        }
    }

    var vatAmountLst  = [ 'VatAmount0', 'VatAmount5', 'VatAmount10', 'GrossValue', 'GrossValue0', 'GrossValue5', 'GrossValue10', 'GrossValueNonTax', 'VATAMOUNTOTHER', 'GROSSVALUEOTHER', 'VatAmount8', 'GrossValue8' ]
    if($('#INV_TYPE').val() ==  "3"){
        vatAmountLst.forEach(function(x){
          var val =  $("#"+ x  ).val()
          if(val && val.FormatNumUK() > 0 ){
            $("#"+ x  ).val('-'+val)
          } 
        }) 
    }
    var _discountAmount = 0;
    var _products = [];
    
    // tách hàm tính toán sản phẩm 
    var temp1 = getListProductString()
     _products = temp1.productList
     check  = temp1.check
     _discountAmount= temp1["discountAmount"]

    if (_products.length == 0) {
        if (check == 0) {
            var msg_HaveNotDataProducts = "Xin lỗi, danh sách sản phẩm chưa có hoặc thông tin sản phẩm bị thiếu!";
            if (VNPT_localization === "en") {
                msg_HaveNotDataProducts = "Sorry, Product Listings Are Unavailable, Or Product Information Is Missing!";
            }
            alert(msg_HaveNotDataProducts)
        }
        else if (check == 1) {
            var msg_DataProductContainsProductThanValueAccepted = "Xin lỗi, danh sách sản phẩm có chứa sản phẩm vượt quá giá trị cho phép của hóa đơn!";
            if (VNPT_localization === "en") {
                msg_DataProductContainsProductThanValueAccepted = "Sorry, The Product List Contains Products That Exceed The Allowed Value Of The Invoice";
            }
            alert(msg_DataProductContainsProductThanValueAccepted)
        }
        else {
            var msg_ProductAmountInvalid = "Xin lỗi, danh sách sản phẩm có chứa sản phẩm vượt quá giá trị chiết khấu cho phép!";
            if (VNPT_localization === "en") {
                msg_ProductAmountInvalid = "Sorry, The product list contains products that exceed the allowed discount value";
            }

            alert(msg_ProductAmountInvalid);
        }

        return false
    }

    $("#PubDatasource").val(JSON.stringify(_products));
    $("#DiscountAmount").val(Math.round(_discountAmount).format(0, 3, typeCurrency).replaceAll('.', ''));

    // get datetime local
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var todayStr = dd + '/' + mm + '/' + yyyy;
    $("#dateTimeClient").val(todayStr);

    $("input[type=text]._number").each(function (i, item) {
        var _val = $(this).val();
        $(this).val(_val.replaceAll('.', ''))
    });

    return true
}



this.setAmountInWords = function (_vatrate) {
  
    var totalNum = $("#Total").val() || "0"
    var VATkhac = $('#VATRateF').val() || "0"
        VATkhac = VATkhac.FormatNumUK()
        totalNum  = totalNum.FormatNumUK()
        totalNumABS  = Math.abs(totalNum)
 
     if(totalNum == 0 ){
          $("#Amount").val(0).attr("value", 0);
          $("#VATAmount").val("0");
          $("#AmountInWords").val("Không đồng")
         return totalNum;
     } 
     
         var _vatamount = 0; 
         var _amount = 0; 
         _vatrate = parseFloat(_vatrate)
        if(_vatrate == -99){
            _vatamount = parseFloat( ((totalNum * VATkhac) / 100).toFixed(BteGlobal.ROUND_TOTAL) )
            _amount = (totalNum + _vatamount);
        }
        else if (_vatrate > 0) { 
             _vatamount = parseFloat( ((totalNum * _vatrate) / 100).toFixed(BteGlobal.ROUND_TOTAL) )
             _amount = (totalNum + _vatamount);
         } else {
             $("#VATAmount").val("0");
             _amount = totalNum;
         } 
         var amountF = parseFloat(_amount.toFixed(BteGlobal.ROUND_TOTAL)) 
 
         if ($('#INV_TYPE').val() == "3" || (amountF < 0 && location.pathname == '/AdJust/CreateAdJustInvWithToken') ) {
            //   amountF = amountF  * -1
            //   _vatamount = parseFloat(_vatamount) * -1
             $("#AmountInWords").val("Giảm " + Math.abs(amountF).ReadNumber(typeCurrency).replace(/\s\s+/g, ' ').toLowerCase());
         } else{
               $("#AmountInWords").val(parseFloat(amountF).ReadNumber(typeCurrency).replace(/\s\s+/g, ' '));
         } 
 
         $("#VATAmount").val(_vatamount.format(0, 3, typeCurrency));
         $("#Amount").val(amountF.format(0, 3, typeCurrency)).attr("value", amountF.format(0, 3, typeCurrency));  
 };

 

this.convertAmount = function () {
    var _tyGia;
    var strTyGia = $("#ExchangeRate").val().FormatNumUK();
    if (strTyGia) {
        _tyGia = parseFloat(strTyGia);
    } else {
        _tyGia = 0;
        $("#ExchangeRate").val(0);
    };
    if (($("#Amount").val() !== null) && (_tyGia >= 0) && $("#CurrencyUnit").val() != "VND") {
        var _amount = parseFloat($("#Amount").val().FormatNumUK());
        var _TongSoTien = parseFloat((_amount * _tyGia).toFixed() ); 

        if($('INV_TYPE').val() == "3"){
            $("#ConvertedAmount").val('-'+_TongSoTien.format(0, 3, "USD"));
        }else 
        $("#ConvertedAmount").val(_TongSoTien.format(0, 3, "USD"));
    };
};

this.formatTagInputNumber = function (typeCurrency) { 

    $("#ConvertedAmount").InitialMoneyUSD();
    $('table.products tbody input._number').unbind('focusout');
    $("#ExchangeRate").formatOnlyNumber();
    $('table.products tbody input._number')
        .each(function (i, item) {
            console.log(` formatTagInputNumber Class ` + $(item).attr('class')  + '   val- '  +  $(item).val() )

            if ($(this).val() =="" ) return
            fnInitialFormatNumber(this);
            if( !  (BteGlobal.IS_EDIT ||  BteGlobal.IS_SIGN_REPLACE_TOKEN ) ){
                $(this).parents('tr:first').find('input.amount').trigger('change');
            } 
        }).ForceNumericOnly()
        .focus(function () {
            var _val = $(this).val();
            $(this).val(_val.replaceAll('.', ''));
        })
        .focusout(function () {
            fnFocusOut(this);
            if( ! (BteGlobal.IS_EDIT || BteGlobal.IS_SIGN_REPLACE_TOKEN ) ){
                $(this).parents('tr:first').find('input.amount').trigger('change');
            }
        });
    $('table.list-bin-bottom tbody input._number').unbind('focusout');
    $('.groupTotal')
        .each(function (i, item) {
            fnInitialFormatNumber(this);
        }).ForceNumericOnly()
        .focus(function () {
            var _val = $(this).val();
            $(this).val(_val.replaceAll('.', ''));
        })
        .focusout(function () {
            fnFocusOut(this);
        });
};


this.readAfterAmountChanged = function () { 
    var _totalamount = parseFloat($('#Total').val().FormatNumUK());
    var _vatamount = 0;
    if ($('#VATAmount').val()) {
        _vatamount = parseFloat($('#VATAmount').val().FormatNumUK());
    }
    var _amount = Math.abs(_totalamount) + Math.abs(_vatamount); 

    if($('#INV_TYPE').val()=="3"){
          $('#AmountInWords').val("Giảm " + Math.abs(parseFloat(_amount)) .ReadNumber(typeCurrency).replace(/\s\s+/g, ' ').toLowerCase()   );
          _amount = _amount * -1
        }else {
        $('#AmountInWords').val((parseFloat($('#Amount').val().FormatNumUK()).ReadNumber(typeCurrency).replace(/\s\s+/g, ' ')));
       
    }
    $('#Amount').val(_amount.format(2, 3, typeCurrency)).trigger('change')
    //.trigger('focusout');
   
};