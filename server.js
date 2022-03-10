// Creating a server with express.
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const {Client} = require('pg'); // Client for database

const app = express();
const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine', 'mustache');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/meds', (req, res)=>{

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,

    });

    client.connect().
    then(()=>{
        const sql = 'SELECT * FROM medicine';
        return client.query(sql);  
    }).then((result)=>{
        res.render('meds', result);
        console.log('Results: ', result);
    });
  
});


app.get('/add', (req, res)=>{
    res.render('meds-form');
}); 

app.post('/meds/add', (req, res)=>{
    console.log('post body', req.body)
    //res.redirect('/meds');

    // Connecting to the database.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });
    // Promises.
    client.connect()
        .then(()=>{ 
            console.log('Connection established');

            const sql = 'INSERT INTO medicine(name, count, brand) VALUES($1, $2, $3)';
            const params = [req.body.name, req.body.count, req.body.brand];
            return client.query(sql, params);
        })
        .then((result)=>{
            console.log('Results? ', result);
            res.redirect('/meds');
        });
});

app.post('/meds/delete/:id', (req, res)=>{
     
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });

    client.connect()
    .then(()=>{
        const sql = 'DELETE FROM medicine WHERE mid = $1'
        const params = [req.params.id];
        return client.query(sql, params);
    })
    .then((results)=>{
        res.redirect('/meds');
    });

});

app.get('/meds/edit/:id', (req, res)=>{
   const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
        const sql = 'SELECT * FROM medicine WHERE mid = $1'
        const params = [req.params.id];
        return client.query(sql, params);
   })
   .then((result)=>{
       //console.log('Result', result);
        res.render('meds-edit',{med: result.rows[0]});
   });    
});

app.post('/meds/edit/:id', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
        const sql = 'UPDATE medicine SET name=$1, count=$2, brand=$3, supplier=$4, price = $5 WHERE mid=$6'
        const params = [req.body.name, req.body.count, req.body.brand, req.body.supplier, req.brand.price, req.params.id];
        return client.query(sql, params);
   })
   .then((result)=>{
        res.redirect('/meds');
   }); 

});
// Dashboard
app.get('/dashboard', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
       return client.query('SELECT SUM(count) FROM medicine; SELECT DISTINCT COUNT(brand) FROM medicine; SELECT COUNT(username) FROM staff;SELECT COUNT(username) FROM supervisor; SELECT DISTINCT COUNT(name) FROM medicine WHERE count < 10; SELECT DISTINCT COUNT(name) FROM medicine WHERE count = 0;');
       
   })
   .then((result)=>{
        console.log('Results', result[0]);
        console.log('Results', result[1]);
        console.log('Results', result[2]);
        console.log('Results', result[3]);
        console.log('Results', result[4]);
        console.log('Results', result[5]);
        res.render('dashboard', {n1: result[0].rows, n2: result[1].rows, n3: result[2].rows, n4: result[3].rows, n5: result[4].rows, n6: result[5].rows});
    })
});

    // Route for staffs page

    // Display users from database
app.get('/staff', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,        
    });

    client.connect()
    .then(()=>{
        const sql = "SELECT * FROM staff";
        return client.query(sql);
    }).then((result)=>{
        //res.render('staff', result);
        res.render('staff', result);
        console.log('Result', result);
        
    });
});


    // Add a new user



    // Routing for add user form url
app.get('/addstaff', (req, res)=>{
    res.render('staff-form');
});



app.post('/staff/add', (req, res)=>{
    console.log('post body', req.body)
    //res.redirect('/meds');

    // Connecting to the database.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });
    // Promises.
    client.connect()
        .then(()=>{ 
            console.log('Connection established');

            const sql = 'INSERT INTO staff(firstname, lastname, sex, email, username, password) VALUES($1, $2, $3, $4, $5, $6)';
            const params = [req.body.firstname, req.body.lastname, req.body.sex, req.body.email, req.body.username, req.body.password];
            return client.query(sql, params);
        })
        .then((result)=>{
            console.log('Results? ', result);
            res.redirect('/staff');
        });
});


// Routing for staff-edit button
app.get('/staff/edit/:id', (req, res)=>{
    const client = new Client({
         user: 'postgres',
         host: 'localhost',
         database: 'medical',
         password: '1234',
         port: 5432,
    });
 
    client.connect()
    .then(()=>{
         const sql = 'SELECT * FROM staff WHERE staffid = $1'
         const params = [req.params.id];
         return client.query(sql, params);
    })
    .then((result)=>{
        //console.log('Result', result);
         res.render('staff-edit',{staff: result.rows[0]});
    });    
 });



// Update staff details
 app.post('/staff/edit/:id', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
        const sql = 'UPDATE staff SET firstname=$1, lastname=$2, sex=$3, email=$4, username=$5, password=$6 WHERE staffid=$7'
        const params = [req.body.firstname, req.body.lastname, req.body.sex, req.params.email, req.params.username, req.params.password, req.params.id];
        return client.query(sql, params);
   })
   .then((result)=>{
        res.redirect('/staff');
   }); 

});




app.post('/staff/delete/:id', (req, res)=>{
     
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });

    client.connect()
    .then(()=>{
        const sql = 'DELETE FROM staff WHERE staffid = $1'
        const params = [req.params.id];
        return client.query(sql, params);
    })
    .then((results)=>{
        res.redirect('/staff');
    });

});



app.get('/supervisor', (req, res)=>{

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,

    });

    client.connect().
    then(()=>{
        const sql = 'SELECT * FROM supervisor';
        return client.query(sql);  
    }).then((result)=>{
        res.render('supervisor', result);
        console.log('Results: ', result);
    });
  
});


app.get('/supervisor/add', (req, res)=>{
    res.render('supervisor-form');
}); 

app.post('/supervisor/add', (req, res)=>{
    console.log('post body', req.body)
    //res.redirect('/meds');

    // Connecting to the database.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });
    // Promises.
    client.connect()
        .then(()=>{ 
            console.log('Connection established');
            const sql = 'INSERT INTO supervisor(firstname, lastname, sex, email, username, password) VALUES($1, $2, $3, $4, $5, $6)';
            const params = [req.body.firstname, req.body.lastname, req.body.sex, req.body.email, req.body.username, req.body.password];
            return client.query(sql, params);
        })
        .then((result)=>{
            console.log('Results? ', result);
            res.redirect('/supervisor');
        });
});



app.post('/supervisor/delete/:id', (req, res)=>{
     
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });

    client.connect()
    .then(()=>{
        const sql = 'DELETE FROM supervisor WHERE superid = $1'
        const params = [req.params.id];
        return client.query(sql, params);
    })
    .then((results)=>{
        res.redirect('/supervisor');
    });

});




app.get('/supervisor/edit/:id', (req, res)=>{
    const client = new Client({
         user: 'postgres',
         host: 'localhost',
         database: 'medical',
         password: '1234',
         port: 5432,
    });
 
    client.connect()
    .then(()=>{
         const sql = 'SELECT * FROM supervisor WHERE superid = $1'
         const params = [req.params.id];
         return client.query(sql, params);
    })
    .then((result)=>{
        //console.log('Result', result);
         res.render('supervisor-edit', {supervisor: result.rows[0]});
    });    
 });
 
 app.post('/supervisor/edit/:id', (req, res)=>{
     const client = new Client({
         user: 'postgres',
         host: 'localhost',
         database: 'medical',
         password: '1234',
         port: 5432,
    });
 
    client.connect()
    .then(()=>{
         const sql = 'UPDATE supervisor SET firstname=$1, lastname=$2, sex=$3, email=$4, username=$5, password=$6 WHERE superid=$7';
         const params = [req.body.firstname, req.body.lastname, req.body.sex, req.params.email, req.params.username, req.body.password, req.params.id];
         return client.query(sql, params);
    })
    .then((result)=>{
         res.redirect('/supervisor');
    }); 
 
 });
 
 
app.get('/login', (req, res)=>{
    res.render('login-form')
});


// app.post('/login', (req, res)=>{
//     var username = req.body.username;
// 	var password = req.body.password;

//     if(username && password){
//         const client = new Client({
//             user: 'postgres',
//             host: 'localhost',
//             database: 'medical',
//             password: '1234',
//             port: 5432,
//        });
//        client.connect().then(()=>{
//             const sql = 'SELECT username, password FROM supervisor WHERE username = $1 AND password =$2';
//             const params = [req.body.username, req.body.password];
//             client.query(sql, params);
//        }).then((result)=>{
//            console.log(result);
//            res.redirect('/dashboard');
//        });
//     }else{
//         res.send("PLEASE ENTER USERNAME AND PASSWORD!");
//     }
// });


app.get('/staffdashboard', (req, res)=>{
    res.render('staff-dashboard');
});



app.get('/sale', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
    });

    client.connect().
    then(()=>{
        const sql = 'SELECT * FROM medicine';
        return client.query(sql);  
    }).then((result)=>{
        res.render('new-sale', result);
    });
  
});

// // Add to purchased medicine list
// app.get('/sell/add/:id', (req, res)=>{
//     const client = new Client({
//          user: 'postgres',
//          host: 'localhost',
//          database: 'medical',
//          password: '1234',
//          port: 5432,
//     });
 
//     client.connect()
//     .then(()=>{
//          const sql = 'SELECT * FROM medicine WHERE mid = $1'
//          const params = [req.params.id];
//          return client.query(sql, params);
//     })
//     .then((result)=>{
//         //console.log('Result', result);
//         res.render('new-sale',{med: result.rows[0]});
        
        
         
//     });    
//  });



app.post('/login', (req, res)=>{
    var username = req.body.username;
    var password = req.body.password;

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect().then(()=>{
       const sql = 'SELECT * FROM supervisor WHERE username = $1 and password = $2';
       const params = [req.body.username, req.body.password];
       return client.query(sql, params);
   }).then((result)=>{
       console.log('Result: ', result);
       res.redirect('/dash');
   })

});


// app.get('/dash', (req, res)=>{
//     res.render('dash');
// });



app.get('/dash', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
       return client.query('SELECT SUM(count) FROM medicine; SELECT DISTINCT COUNT(brand) FROM medicine; SELECT COUNT(username) FROM staff;SELECT COUNT(username) FROM supervisor; SELECT DISTINCT COUNT(name) FROM medicine WHERE count < 10; SELECT DISTINCT COUNT(name) FROM medicine WHERE count = 0;');
       
   })
   .then((result)=>{
        console.log('Results', result[0]);
        console.log('Results', result[1]);
        console.log('Results', result[2]);
        console.log('Results', result[3]);
        console.log('Results', result[4]);
        console.log('Results', result[5]);
        res.render('dash', {n1: result[0].rows, n2: result[1].rows, n3: result[2].rows, n4: result[3].rows, n5: result[4].rows, n6: result[5].rows});
    })
});


// app.get('/logins', (req, res)=>{
//     res.render('login');
// });


// app.get('/reg', (req, res)=>{
//     res.render('reg')
// });


// Supervisor Dashboard


app.get('/dashboard/supervisor', (req, res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,
   });

   client.connect()
   .then(()=>{
       return client.query('SELECT SUM(count) FROM medicine; SELECT DISTINCT COUNT(brand) FROM medicine; SELECT COUNT(username) FROM staff;SELECT COUNT(username) FROM supervisor; SELECT DISTINCT COUNT(name) FROM medicine WHERE count < 10; SELECT DISTINCT COUNT(name) FROM medicine WHERE count = 0;');
       
   })
   .then((result)=>{
        console.log('Results', result[0]);
        console.log('Results', result[1]);
        console.log('Results', result[2]);
        console.log('Results', result[3]);
        console.log('Results', result[4]);
        console.log('Results', result[5]);
        res.render('supervisor-dash', {n1: result[0].rows, n2: result[1].rows, n3: result[2].rows, n4: result[3].rows, n5: result[4].rows, n6: result[5].rows});
    })
});

    //Supervisor Table
app.get('/super', (req, res)=>{

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical',
        password: '1234',
        port: 5432,

    });

    client.connect().
    then(()=>{
        const sql = 'SELECT * FROM supervisor';
        return client.query(sql);  
    }).then((result)=>{
        res.render('super', result);
        console.log('Results: ', result);
    });
  
});



app.listen(5001, ()=>{
    console.log('Listening to port 5001');
});