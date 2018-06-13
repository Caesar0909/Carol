// @flow

export type CancelablePromise = {
    promise: Promise<any>,
    cancel: Function
};

export default function makeCancelable (promise: Promise<any>): CancelablePromise {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val));
        promise.catch((error) => hasCanceled_ ? reject({ isCanceled: true }) : reject(error));
    });

    return {
        promise: wrappedPromise,
        cancel () {
            hasCanceled_ = true;
        }
    };
}
