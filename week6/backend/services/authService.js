const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const {HttpError} = require('../utils/error'); 

/**
 * Auth Service
 * 인증 관련 비즈니스 로직을 담당
 */

/**
 * 회원가입
 */
async function register(username, password) {
    // TODO: Implement
    // 1. 입력 유효성 검사
    if(username.trim() === '' || password.trim() === '') 
        throw new HttpError("아이디 비번 입력 빈칸 허용안됨!!", 400) ;

    // 2. 중복 사용자 확인 (userRepository.existsByUsername)
    const hasUser = await userRepository.existsByUsername(username) ; 
    if(hasUser) throw new HttpError("동일한 유저 이름이 있습니다", 409) ;
    // 3. 비밀번호 해싱 (hashPassword)

    const hashedPassword = await hashPassword(password) ; 
    // 4. 사용자 생성 (userRepository.create)
    const response = await userRepository.create(username, hashedPassword);

    // 5. 사용자 정보 반환 (비밀번호 제외)
    return response ;
}

/**
 * 로그인
 */
async function login(username, password) {
    // TODO: Implement
    if(username.trim() === '' || password.trim() === '') 
        throw new HttpError("아이디 비번 입력 빈칸 안됨!!", 400) ;
    // 2. 사용자 조회 (userRepository.findByUsername)
    const user = await userRepository.findByUsername(username) ; 
    if(!user) throw new HttpError("로그인에 실패했습니다(유저 이름이 없습니다.)", 401) ;
    // 3. 비밀번호 확인 (comparePassword)
    if(!(await comparePassword(password, user.password)))
        throw new HttpError("로그인에 실패했습니다(비번 틀림)", 401) ; 
    // 4. 사용자 정보 반환 (비밀번호 제외)
    return {
        id : user.id,
        username : user.username 
    } ; 
}

/**
 * 현재 사용자 조회
 */
async function getCurrentUser(userId) {
    // TODO: Implement
    // 1. 사용자 조회 (userRepository.findById)
    const user = await userRepository.findById(userId) ; 
    if(!user) throw new HttpError("유저를 찾을수없습니다.", 404) ;

    // 2. 사용자 정보 반환 (비밀번호 제외)
    return {
        id : user.id,
        username : user.username 
    } ; 
}

module.exports = {
    register,
    login,
    getCurrentUser
};
