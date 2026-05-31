// utils/alerta.js
export const alertaYVolver = (res, req, status, mensaje) => {
    return res.status(status).send(`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        
        <div class="modal fade" id="modalAlerta" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow border-0">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title fw-bold">¡Atención!</h5>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <p class="fs-5 m-0 text-dark">${mensaje}</p>
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-warning fw-semibold px-4" id="btnEntendido">Entendido</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // 1. Levantamos el modal de Bootstrap apenas carga la pantalla
            const miModal = new bootstrap.Modal(document.getElementById('modalAlerta'));
            miModal.show();

            // 2. Cuando el usuario hace clic en "Entendido", lo mandamos de vuelta a donde estaba
            document.getElementById('btnEntendido').addEventListener('click', () => {
                window.location.href = "${req.get('referer') || '/home'}";
            });
        </script>
    `);
};