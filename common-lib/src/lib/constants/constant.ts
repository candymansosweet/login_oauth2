export class CommonValue {
  // public static readonly TOKEN = 'msa-token';
    public static readonly ReferenceType = ['object', 'function', 'date', 'regexp', 'map', 'set', 'weakmap', 'weakset', 'promise', 'error', 'proxy'];
    public static readonly ValueType = ['undefined', 'boolean', 'number', 'string', 'symbol', 'bigint'];
    public static readonly ReferenceTypeEnum = {
        OBJECT: 'object',
        FUNCTION: 'function',
        ARRAY: 'array',
        DATE: 'date',
        REGEXP: 'regexp',
        MAP: 'map',
        SET: 'set',
        WEAKMAP: 'weakmap',
        WEAKSET: 'weakset',
        PROMISE: 'promise',
        ERROR: 'error',
        PROXY: 'proxy'
    }
    public static readonly INVALID_DATA = "Dữ liệu không hợp lệ";
    public static readonly NULL_VALUES = [null, undefined, ''];
    public static readonly REGEX_REMOVE_HTML = /<[^>]+>/g;
    public static readonly NotifiContentType = {
        DEFAULT: 0,
        HTML: 1
    }
};
export class ErrMess {
  public static readonly INVALID_ONLY_WHITE_SPACE = "Không được chỉ chứa khoảng trắng";
  public static readonly INVALID_DATA = "Dữ liệu không hợp lệ";
  public static readonly INVALID_TIME_LINE = "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc";
}
export class Regex {
  public static readonly EMAIL_CHAR = /^[^\s@][^\s@]+@[^\s@]+\.[^\s@]+[^0-9\s]$/;
  public static readonly HTML_CHAR = /<[^>]+>/g;

}
export class StorageKeys {
  public static readonly USER = 'user-key';
  public static readonly TOKEN = 'token-key';
}
export class RouteDataKeys {
  public static readonly ROLE = 'role';
}

export class PermissionDataKey {
  public static readonly ROLES = 'roles';
}
