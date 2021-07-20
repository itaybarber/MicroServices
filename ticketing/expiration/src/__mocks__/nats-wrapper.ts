export const natsWrapper = {
  client : {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback();
    }) // Creating a mock func. This is going to ret a new func and 
                       // assign it to the publish property 
  },
};