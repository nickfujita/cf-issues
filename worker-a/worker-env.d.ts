
interface WorkerAEnv extends Env {
  WORKER_B: Service<
    import('../worker-b/src/index').default
  >;
}
