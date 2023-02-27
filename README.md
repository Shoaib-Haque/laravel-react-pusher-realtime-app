# laravel-react-pusher-realtime-app
<ol>
    <li><strong>clone git repo</strong>
        <br>git clone https://github.com/Shoaib2018/laravel-react-pusher-realtime-app.git
    </li>
</ol>

# backend
<ol>
    <li><strong>install backend</strong><br></li>composer create-project laravel/laravel backend
    <li><strong>set database credentials on .env</strong></li>
    <li><strong>create migration files</strong></li>
    <li><strong>migrate tables</strong><br>php artisan migrate</li>
    <li><strong>create models</strong></li>
    <li><strong>authentication</strong></li>
    <ol>
        <li><strong>authentication using jwt</strong><br>
            <a href="https://www.positronx.io/laravel-jwt-authentication-tutorial-user-login-signup-api/">laravel-jwt-authentication-tutorial</a>
        </li>
        <li><strong>install jwt</strong><br>composer require -w tymon/jwt-auth --ignore-platform-reqs</li>
        <li><strong>go to config/app.php</strong><br>
        <ul>
            <li>include the laravel service provider inside the providers array.<br>
                'providers' => [<br>
                    ....<br>
                    ....<br>
                    Tymon\JWTAuth\Providers\LaravelServiceProvider::class,<br>
                ],<br>
            </li>
            <li>include the JWTAuth and JWTFactory facades inside the aliases array.<br>
                'aliases' => [<br>
                    ....<br>
                    'JWTAuth' => Tymon\JWTAuth\Facades\JWTAuth::class,<br>
                    'JWTFactory' => Tymon\JWTAuth\Facades\JWTFactory::class,<br>
                    ....<br>
                ],
            </li>
        </ul>
        <li><strong>publish the jwt package’s configuration</strong><br>
            php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"</li>
        <li><strong>generate jwt secret key</strong><br>php artisan jwt:secret</li>
        <li><strong>create middleware for API</strong></li>
        <ul>
            <li>php artisan make:middleware Api</li>
            <li>copy class content from vendor\laravel\framework\src\Illuminate\Routing\Middleware\SubstituteBindings.php and paste inside Middleware/Api.php</li>
        </ul>
        <li><strong>configure auth guard: goto config/auth.php</strong><br></li>
        <ul>
            <li>
            'guards' => [<br>
                'admin' => [<br>
                    'driver' => 'jwt',<br>
                    'provider' => 'admins',<br>
                    'hash' => false,<br>
                ]<br>
                'user' => [<br>
                    'driver' => 'jwt',<br>
                    'provider' => 'users',<br>
                    'hash' => false,<br>
                ]<br>
            ],<br><br>
            'providers' => [<br>
                'users' => [<br>
                    'driver' => 'eloquent',<br>
                    'model' => App\Models\Users::class,<br>
                ],<br>
                'admins' => [<br>
                    'driver' => 'eloquent',<br>
                    'model' => App\Models\Admins::class,<br>
                ],<br>
            ],
            </li>
        </ul>
        <li><strong>configure middleware: goto http/Kernel.php</strong><br></li>
        <ul>
            <li>
                protected $middlewareGroups = [<br>
                    -------------------------------<br>
                    'admin' => [<br>
                        \App\Http\Middleware\Api::class,<br>
                    ],<br>
                    'user' => [<br>
                        \App\Http\Middleware\Api::class,<br>
                    ],<br>
                ];
            </li>
        </ul>
    </ol>
    <li><strong>real-time-application-using-pusher</strong>
        <br><a href="https://hanieasemi.medium.com/realtime-application-with-laravel-and-react-js-88bf17be4838">RealTime Application with Laravel and React.js</a>
        <br><a href="https://medium.com/@ekponoambrose/laravel-pusher-without-echojs-628bf192cac7">Laravel + Pusher without Echojs</a>
        <br><a href="https://vikramatech.co/article/Realtime-chat-application-in-Laravel-React-and-Pusher">Realtime chat application in Laravel, React and Pusher</a>
        <br><a href="https://pusher.com/tutorials/online-presence-laravel/">Build online presence into your Laravel app</a>
    </li>
    <li><strong>install the Pusher Channels PHP SDK</strong>
        <br>composer require pusher/pusher-php-server
    </li>
    <li><strong>create app on the Pusher website</strong>
        <br><a href="https://pusher.com/">Pusher</a>
    </li>
    <li><strong>change pusher credentials on .env</strong>
        <br>PUSHER_APP_ID, PUSHER_APP_SECRET, PUSHER_APP-KEY
    </li>
    <li><strong>change BROADCAST_DRIVER=pusher on .env</strong></li>
    <li><strong>goto config/app.php</strong>
        <br>uncomment App\Providers\BroadcastServiceProvider::class,
    </li>
    <li><strong>run backend server</strong><br>php artisan serve</li>
</ol>

# frontend
<ol type="1">
    <li><strong>install react</strong><br>npx create-react-app frontend</li>
    <li><strong>goto src\index.js</strong><br>comment out React.StrictMode</li>
    <li><strong>change directory</strong><br>cd frontend</li>
    <li><strong>install axios, react-bootstrap</strong><br>npm install axios react-bootstrap bootstrap</li>
    <li><strong>install react-router-dom, sweetalert2</strong>
        <br>npm install react-router-dom sweetalert2 --save
    </li>
    <li><strong>install react-bootstrap-table</strong>
        <br>npm i react-bootstrap-table-next --legacy-peer-deps
    </li>
    <li><strong>install react-bootstrap-table2-toolkit</strong>
        <br>npm i react-bootstrap-table2-toolkit --legacy-peer-deps
    </li>
    <li><strong>install react-helmet</strong><br>npm install react-helmet</li>
    <li><strong>install laravel-echo and pusher-js</strong><br>npm install laravel-echo pusher-js</li>
    <li><strong>add api and pusher credentials on .env</strong>
        <br>REACT_APP_API_BASE_URL, REACT_APP_PUSHER_API_KEY, REACT_APP_PUSHER_CLUSTER
    </li>
    <li><strong>run the frontend</strong><br>npm run</li>
</ol>
