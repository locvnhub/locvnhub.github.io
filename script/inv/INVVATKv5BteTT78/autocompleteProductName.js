;// fix autocompleteProductName 1-9-2024

function autocompleteProductName(codeOrName){
    codeOrName = codeOrName || 'name'
    var pathURL = codeOrName == "name" ? 'Name' : 'Code'  
  
  $('table.products tbody input.'+codeOrName) .unbind('autocompleteopen')
  $('table.products tbody input.'+codeOrName) .unbind('autocompleteclose')

     $('table.products tbody input.'+codeOrName) 
        .data('autocomplete_on', false)
        .bind('autocompleteopen', function (event, ui) {
            $(this).data('autocomplete_on', true);
        })
        .bind('autocompleteclose', function (event, ui) {
            $(this).data('autocomplete_on', false);
        })
        .autocomplete({
            source: function (request, response) {
                console.log('request.term', request)
                request.term = request.term ||""
                request.term = request.term.toLowerCase()
               
                $.ajax(
                    {
                        type: "POST",
                        url: '/Product/SeachBy'+pathURL,
                        dataType: "JSON",
                        data: {
                            searchText: request.term
                        },
                        success: function (data) {
                            if (data === null  ) {
                                if(codeOrName=='name')
                                $(this).parents('tr:first').find('input.Code').val("");
                                else 
                                $(this).parents('tr:first').find('input.Name').val("");
                            }

                            var data2 = [] 

                            if (codeOrName == 'code') { 
                                data2 = data2.concat(data.filter(x => x.Code.toLowerCase().indexOf(request.term) == 0).slice(0, 5)) 
                                            .concat(data.filter(x=>x.Code.toLowerCase().indexOf(request.term)==1 ).slice(0,3))
                                            .concat(data.filter(x=>x.Code.toLowerCase().indexOf(request.term)==3 ).slice(0,3))
                                            .concat(data.filter(x=>x.Code.toLowerCase().indexOf(request.term) > 1  ).slice(0,5))
                            }  
                            else   {
                                data2 = data2.concat(
                                    data.filter(x => x.Name.toLowerCase().indexOf(request.term) == 0).slice(0, 5))
                                    .concat(data.filter(x => x.Name.toLowerCase().indexOf(request.term) == 1).slice(0, 3))
                                    .concat(data.filter(x => x.Name.toLowerCase().indexOf(request.term) == 3).slice(0, 3))
                                    .concat(data.filter(x => x.Name.toLowerCase().indexOf(request.term) > 0).slice(0, 5))
                            }  

                            response($.map(data2, function (item) {
                                return {
                                    label: item.Code + ' | '+ item.Name ,
                                    Name: item.Name,
                                    Unit: item.Unit,
                                    Price: item.Price,
                                    Code: item.Code,
                                }
                            }));
                        } //,
                       
                    });
            },
            minLength: 1,
            select: function (event, ui) {
              $(this).parents('tr:first').find('input.unit').val(ui.item.Unit);
                if(codeOrName == 'name'){
                    $(this).parents('tr:first').find('input.code').val(ui.item.Code);
                }else {
                    $(this).parents('tr:first').find('input.name').val(ui.item.Name);
                }
                
                $(this).parents('tr:first').find('input.price').val(ui.item.Price.toString().replace('.', ',')).trigger('focusout');

                if (event.which != 9 || event.keyCode != 9) {
                    $(this).parents('tr:first').find('input.quantity').focus();
                } else {
                    $(this).parents('tr:first').find('input.unit').focus();
                }
                
                $(this).val(ui.item[pathURL]).trigger('change'); 
                return false;
            },
            appendTo: "#searchAutocomplete",
            open: function () {
                var position = $(this).position(),
                    left = position.left, top = position.top + 20;
                $("#searchAutocomplete > ul").css({
                    left: left + "px",
                    top: top + "px"
                });
            }
        });
} 

$(document).ready(function () {
  // chạy lại 
  bindEvents2Table()
})
