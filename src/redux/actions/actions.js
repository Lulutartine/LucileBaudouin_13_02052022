import { getToken, userData, userEdit } from '../../service/service';
import { saveLocal, clearStorage } from '../../service/storage';

/**
 * @typedef {(
 * 'LOADING_IN_PROGRESS'
 * |'LOGIN_SUCEED'
 * |'LOGIN_FAILED'
 * |'USER_PROFILE'
 * |'SAVE_SUCCEED'
 * |'SAVE_FAILED'
 * )} actionsTypes
 */

const checkCredentials = (email, password, remember) => {
   return async (dispatch) => {
      dispatch({
         /** @type {actionsTypes} */
         type: 'LOADING_IN_PROGRESS',
         payload: true,
      });

      try {
         const token = await getToken(email, password);

         dispatch({
            /** @type {actionsTypes} */
            type: 'LOGIN_SUCEED',
            payload: { token },
            loader: true,
            error: false,
         });

         const user = await userData();
         const firstName = user.firstName;
         const lastName = user.lastName;
         saveLocal(token, remember, firstName, lastName);

         dispatch({
            /** @type {actionsTypes} */
            type: 'USER_PROFILE',
            payload: { user },
         });
      } catch (err) {
         clearStorage();
         console.error(err);
         dispatch({
            /** @type {actionsTypes} */
            type: 'LOGIN_FAILED',
            payload: true,
         });
      }
   };
};

const setUserData = (firstName, lastName) => {
   return async (dispatch) => {
      try {
         dispatch({
            /** @type {actionsTypes} */
            type: 'SAVE_SUCCEED',
            payload: {
               user: { firstName, lastName },
            },
         });
         await userEdit(firstName, lastName);
      } catch (err) {
         console.error(err);
         dispatch({
            /** @type {actionsTypes} */
            type: 'SAVE_FAILED',
         });
      }
   };
};

export { checkCredentials, setUserData };