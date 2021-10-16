import { Customer } from "./dto/Customer";
import $ from 'jquery';

// const BASE_API = 'https://6c20934f-3597-4e3a-a6b8-bb3340352c7a.mock.pstmn.io';
const BASE_API = 'http://localhost:8080/pos';
const CUSTOMERS_SERVICE_API = `${BASE_API}/customers`;
const PAGE_SIZE = 6;

let customers: Array<Customer> = [];
let totalCustomers = 0;
let selectedPage = 1;
let pageCount = 1;

loadAllCustomers();
/* API Calls */


/* start up focus */
$('#txt-id').trigger('focus');

/* Save part */
$('#btn-save').on('click', (eventData) => {
    eventData.preventDefault();

    const txtId = $('#txt-id');
    const txtName = $('#txt-name');
    const txtAddress = $('#txt-address');

    let id = (txtId.val() as string).trim();
    let name = (txtName.val() as string).trim();
    let address = (txtAddress.val() as string).trim();

    let validated = true;
    $('#txt-id, #txt-name, #txt-address').removeClass('is-invalid');

    if (address.length < 3) {
        txtAddress.addClass('is-invalid');
        txtAddress.trigger('select');
        validated = false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
        txtName.addClass('is-invalid');
        txtName.trigger('select');
        validated = false;
    }

    if (!/^C\d{3}$/.test(id)) {
        txtId.addClass('is-invalid');
        txtId.trigger('select');
        validated = false;
    }

    if (!validated) return;

    if (txtId.attr('disabled')) {

        const selectedRow = $("#tbl-customers tbody tr.selected");
        updateCustomer(new Customer(id, name, address));
        return;
    }


    saveCustomer(new Customer(id, name, address));
});

/* Select part */
$('#tbl-customers tbody').on('click', 'tr', function () {

    const id = $(this).find("td:first-child").text();
    const name = $(this).find("td:nth-child(2)").text();
    const address = $(this).find("td:nth-child(3)").text();

    $('#txt-id').val(id).attr('disabled', "true");
    $('#txt-name').val(name);
    $('#txt-address').val(address);

    $("#tbl-customers tbody tr").removeClass('selected');
    $(this).addClass('selected');

});

/* Delete part */
$('#tbl-customers tbody').on('click', '.trash', function (eventData) {
    if (confirm('Are you sure to delete?')) {
        deleteCustomer(($(eventData.target).parents("tr").find('td:first-child')).text());
    }
});

/* Clear button */
$('#btn-clear').on('click', () => {
    $("#tbl-customers tbody tr.selected").removeClass('selected');
    $("#txt-id").removeAttr('disabled').trigger('focus');
});


/* Pagination part */
function initPagination(): void {

    pageCount = Math.ceil(totalCustomers / PAGE_SIZE);

    showOrHidePagination();
    if (pageCount === 1) return;

    let html = `<li class="page-item"><a class="page-link" href="#!">«</a></li>`;

    for (let i = 0; i < pageCount; i++) {
        html += `<li class="page-item ${selectedPage === (i + 1) ? 'active' : ''}"><a class="page-link" href="javascript:void(0);">${i + 1}</a></li>`;
    }

    html += `<li class="page-item"><a class="page-link" href="javascript:void(0);">»</a></li>`;

    $("ul.pagination").html(html);

    if (selectedPage === 1) {
        $(".page-item:first-child").addClass('disabled');
    } else if (selectedPage === pageCount) {
        $(".page-item:last-child").addClass('disabled');
    }

    $(".page-item:first-child").on('click', () => navigateToPage(selectedPage - 1));
    $(".page-item:last-child").on('click', () => navigateToPage(selectedPage + 1));

    $(".page-item:not(.page-item:first-child, .page-item:last-child)").on('click', function () {
        navigateToPage(+$(this).text());
    });

}


/* Navigation Page */
function navigateToPage(page: number): void {

    if (page < 1 || page > pageCount) return;

    selectedPage = page;
    loadAllCustomers();

}

/* Added Show and Hide Pagination */
function showOrHidePagination(): void {
    pageCount > 1 ? $(".pagination").show() : $('.pagination').hide();
}

/* load customer part */
function loadAllCustomers(): void {

    $.get(CUSTOMERS_SERVICE_API + `?page=${selectedPage}&size=${PAGE_SIZE}`).then((data) => {
        customers = data;

        $('#tbl-customers tbody tr').remove();

        data.forEach((c) => {
            const rowHtml = `<tr>                 
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.address}</td>
                <td><i class="fas fa-trash trash"></i></td>
            </tr>` ;


            $('#tbl-customers tbody').append(rowHtml);
        });

        initPagination();
    }).catch((err) => {
        alert("Failed to fetch customer...!");
        console.log(err);
    }).always(() => {
        console.log("This is working Always");
    });
}

/* Save customer */
function saveCustomer(customer: Customer): void {
    http('POST', CUSTOMERS_SERVICE_API, function (){
        this.onreadystatechange = () => {

            if (this.readyState !== this.DONE) return;

            if (this.status !== 201) {
                console.error(this.responseText);
                alert("Failed to save the customer, retry");
                return;
            }

            alert("Customer has been saved successfully");

            totalCustomers++;
            pageCount = Math.ceil(totalCustomers / PAGE_SIZE);

            navigateToPage(pageCount);
            $('#txt-id, #txt-name, #txt-address').val('');
            $('#txt-id').trigger('focus');
        };
    }, {'Content-Type': 'application/json'}, JSON.stringify(customer));
}

/* Update customer */
function updateCustomer(customer: Customer): void {
    http('PUT', CUSTOMERS_SERVICE_API, function () {
        this.onreadystatechange = () => {

            if (this.readyState !== this.DONE) return;

            if (this.status !== 204) {
                alert("Failed to update the customer, retry");
                return;
            }

            alert("Customer has been updated successfully");
            $("#tbl-customers tbody tr.selected").find("td:nth-child(2)").text($("#txt-name").val() as string);
            $("#tbl-customers tbody tr.selected").find("td:nth-child(3)").text($("#txt-address").val() as string);
            $('#txt-id, #txt-name, #txt-address').val('');
            $('#txt-id').trigger('focus');
            $("#tbl-customers tbody tr.selected").removeClass('selected');
            $('#txt-id').removeAttr('disabled');

        };
    },  {'Content-Type': 'application/json'}, JSON.stringify(customer));
}

/* Delete customer */
function deleteCustomer(id: string): void {

    http('DELETE', CUSTOMERS_SERVICE_API + `?id=${id}`, function () {
        if (this.readyState === this.DONE) {

            if (this.status !== 204) {
                alert("Failed to delete customer, try again...!");
                return;
            }
        
            totalCustomers--;
            pageCount = Math.ceil(totalCustomers / PAGE_SIZE);            
            navigateToPage(pageCount);
        
        }

    })
}


function http(method: string, url: string, callFn: ((this: XMLHttpRequest, ev: Event) => any) | null, headers?: {[header: string]: string}, body?: any){
    const http = new XMLHttpRequest();
    http.onreadystatechange = callFn;

    http.open(method, url, true);

    if(headers){
        for(const header in headers){
            http.setRequestHeader(header,headers[header]);
        }
    }

    http.send(body??"")
}
