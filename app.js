var express = require('express');
var exphbs = require('express-handlebars');
// SDK de Mercado Pago
const mercadopago = require('mercadopago');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    const domain = req.protocol + '://' + req.get('host');
    console.log('el domain', domain);
    
    mercadopago.configure({
        access_token: 'APP_USR-6718728269189792-112017-dc8b338195215145a4ec035fdde5cedf-491494389'
    });
    // Crea un objeto de preferencia
    let preference = {
        items: [
            {
                id: 1234,
                title: req.query.title,
                unit_price: parseFloat(req.query.price),
                quantity: 1,
                picture_url: domain +  req.query.img,
                description: 'Dispositivo móvil de Tienda e-commerce'
            }
        ],
        payer: {
            name: 'Lalo Landa',
            email: 'test_user_58295862@testuser.com',
            phone: {
                area_code: '55',
                number: 49737300
            },
            address: {
                street_name: 'Insurgentes Sur',
                street_number: 1602,
                zip_code: '03940'
            }
        },
        external_reference: 'notificaction_url',
        notification_url: 'https://webhook.site/9ced0929-155c-4d2b-95bd-dbdd047d6de8',
        back_urls: {
            success: domain,
            failure: domain
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6
        }
        

    };
    mercadopago.preferences.create(preference)
        .then(function (response) {
            req.query.init_point = response.body.init_point
            req.query.preferenceId = response.body.id;
            res.render('detail', req.query);
        }).catch(function (error) {
            console.log(error);
        });

    
});
//5031 7557 3453 0604
//"password": "qatest5413"
//"email": "test_user_72444563@testuser.com"

app.post('/notifications', function(req, res){
    return res.send('ok');
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(3000);