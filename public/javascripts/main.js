
$(document).ready(function(){
    var table = $("#example").DataTable({
        ajax: "/manage/getResList/"+$('#target').text(),
        columns: [
            {data: "key"},
            {data: "restaurant_name"},
            {data: "address"},
            {data: "status"}
        ],
        "columnDefs": [
            {
                targets: [0,3],
                visible: false
            }
        ],
        select: true,
        searching: false,
        paging: false
    });
    
    $('#example tbody').on('click', 'tr', function(){
        if($(this).hasClass('selected')){
            $(this).removeClass('selected');
        }else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        
    })
   
    $('#deleteButton').click( function () {
        var ids = table.row('.selected').data()
        if(typeof ids != 'undefined')
            $.post('/manage/deleteItem',{name: ids.restaurant_name, address: ids.address, targetList: $('#target').text(), key: ids.key},function(data){
                location.reload();
            })
        //table.row('.selected').remove().draw( false );
    });
    $('#addButton').click(function() {
        clear();
        $('#adding_form').attr('action','/manage/createNewRecord/'+ $('#target').text());
        
    })
    $('#updateButton').click(function() {
        var ids = table.row('.selected').data()
        if(typeof ids != 'undefined'){
            $('#name').val(ids.restaurant_name)
            $('#address').val(ids.address)
            $("#status option").filter(function(){
                return $.trim($(this).text()) ==  ids.status
            }).prop('selected', true);
            $('#status').selectpicker('refresh');
            $('#adding_form').attr('action','/manage/updateRecord/'+ $('#target').text());
            var input = $('<input>').attr('name','pkey').attr('id','pkey').attr('type','hidden').val(ids.key)
            $('#adding_form').append(input);
        }
    })
    $('#btnRandom').click(function(){
        var option = $('#randomOptions').find("option:selected").text();
        $.get('/getRandomItem/'+option,function(data,status){
            $('#randomResult').html('<h2>'+data.restaurant_name+'</h2>'+'<p>地址:'+data.address+'</p>');
           
        })
    })
   
    function clear(){
        $('#pkey').remove();
        $('#name').val('');
        $('#address').val('');
        $("#status option").filter(function(){
            return $.trim($(this).text()) ==  'enable'
        }).prop('selected', true);
        $('#status').selectpicker('refresh');
    }
});