
// Validate submit 
//--- /Validate Check Mã số thuế
this.submit = function () {

    if(!checkMstCusName())
    return false

    var VNPT_localization = localStorage.getItem("VNPT_localization"); 

    submit_over_begin()

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
    var _VATRateF = $("#VATRateF").val();    

    if(_vatrate == -99 && _VATRateF != '' ){
        _VATRateF =  _VATRateF.FormatNumUK();
        if([0,5,8,10,-1,-2].indexOf(_VATRateF)  >-1 ){
            $("#VATRateItem").val(_VATRateF)
            $("#VATRateF").val('')
            _vatrate =_VATRateF
        }
    }

    if( BteGlobal.IS_INV_NO_VAT){
        _vatrate = -4
    }

    if (_vatrate > 0) {
        if (_vatrate == 10) {
            $("#VatAmount10").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue10").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
        else if (_vatrate == 5) {
            $("#VatAmount5").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue5").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
       else if (_vatrate == 8) {
            $("#VatAmount8").val(_vatamount.toString().replaceAll(".", ","));
            $("#GrossValue8").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
    }
    else if (_vatrate == -99) {

        var tempRATE = $('#VATRateF').val()

        if ($('#VATRateF').val() == "" || $('#VATRateF').val() == null) {

            // var msg_EnterVATRateF = "Cần nhập thuế suất!";
            // if (VNPT_localization === "en") {
            //     msg_EnterVATRateF = "Need To Enter VATRate!";
            // }
            // alert(msg_EnterVATRateF);
            // return false;
            tempRATE = -3
            $('#VATRateF').val(tempRATE)
            $('table.products .VATRate').val(tempRATE) // change product
        } 
        _vatrate = parseFloat( tempRATE ||"0" )  
            
        $("#VATAMOUNTOTHER").val(_vatamount.toString().replaceAll(".", ","));
        $("#GROSSVALUEOTHER").val(_totalamount.toString().replaceAll(".", ","));
        $("#VATRate").val( $('#VATRateF').val());
    
       

       
    }
    else {
        if (_vatrate == -1) {
            $("#GrossValue").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
        else if (_vatrate == 0) {
            $("#VatAmount0").val("0");
            $("#GrossValue0").val(_totalamount.toString().replaceAll(".", ","));
            $("#VATRate").val(_vatrate);
        }
        else if (_vatrate == -2) {
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

    // if ($("#Total").val().indexOf("-") >= 0 && $('#INV_TYPE').val() != "3" &&  BteGlobal.IS_DIEU_CHINH_TANG_GIAM == false) {
    //     var msg_TotalAmountNegative = "Xin lỗi, hóa đơn có giá trị âm [Tổng tiền hóa đơn], chưa thể phát sinh giao dịch.";
    //     if (VNPT_localization === "en") {
    //         msg_TotalAmountNegative = "Sorry, The Invoice Has A Negative Value [amount Invoice], No Transactions Yet.";
    //     }
    //     alert(msg_TotalAmountNegative);
    //     return false;
    // }

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
     _discountAmount= ($('#DiscountAmount').val()||"0").FormatNumUK()
    

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

    _products = submitProducts_ext (_products)

    $("#PubDatasource").val(JSON.stringify(_products));

    $("#DiscountAmount").val(Math.round(_discountAmount).format(0, 3, typeCurrency).replaceAll('.', ''));

    // get datetime local
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var todayStr = dd + '/' + mm + '/' + yyyy;

    if($("#dateTimeClient").val() != undefined ){
        $("#dateTimeClient").val(todayStr);
    }

   var isArisingDate =   parseInt( ($('#isArisingDate').val() || "0"))   
    
    if ($('#ArisingDate').val() == "" && isArisingDate == 1) {
        $('#ArisingDate').val(todayStr)
        $('#defaultArisingDate').val(todayStr)
    } else if ($('#ArisingDate').val() == "" && isArisingDate == 0) {
        // $('#ArisingDate').remove() 
        // $('#defaultArisingDate').remove()
        $('#ArisingDate').attr('name','ArisingDate_remove')
        $('#defaultArisingDate').attr('name','defaultArisingDate_remove')
    }
    if ($('#ArisingDate').val() != "" && isArisingDate == 0) {
        $('#isArisingDate').val(1)
    }

    $("input[type=text]._number").each(function (i, item) {
        var _val = $(this).val();
        $(this).val(_val.replaceAll('.', ''))
    });

    if( submit_over() == false){
        return false
    }
    return true
}
