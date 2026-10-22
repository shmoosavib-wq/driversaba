const randomTime = (max = 500) => Math.floor(Math.random() * max) + 500;

export const MockApi = (data) =>
  new Promise((resolve, reject) => {
    let time = randomTime();

    return setTimeout(() => {
      if (time % 100 === 0) reject("error");
      resolve(data);
    }, time);
  });
