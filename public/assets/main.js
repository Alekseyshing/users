document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    root.innerHTML = `
        <div class="container">
            <h1 class="text-center mb-4">Users List</h1>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Welcome</h5>
                            <p class="card-text">Please log in or register to continue.</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" onclick="window.location.href='/login'">Login</button>
                                <button class="btn btn-outline-primary" onclick="window.location.href='/register'">Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}); 