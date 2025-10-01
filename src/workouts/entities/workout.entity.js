"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/entities/user.entity");
var Workout = function () {
    var _classDecorators = [(0, typeorm_1.Entity)("workouts")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _duration_decorators;
    var _duration_initializers = [];
    var _duration_extraInitializers = [];
    var _restTime_decorators;
    var _restTime_initializers = [];
    var _restTime_extraInitializers = [];
    var _difficulty_decorators;
    var _difficulty_initializers = [];
    var _difficulty_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _exercisesList_decorators;
    var _exercisesList_initializers = [];
    var _exercisesList_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _athlete_decorators;
    var _athlete_initializers = [];
    var _athlete_extraInitializers = [];
    var _athleteId_decorators;
    var _athleteId_initializers = [];
    var _athleteId_extraInitializers = [];
    var Workout = _classThis = /** @class */ (function () {
        function Workout_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.duration = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
            this.restTime = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _restTime_initializers, void 0));
            this.difficulty = (__runInitializers(this, _restTime_extraInitializers), __runInitializers(this, _difficulty_initializers, void 0));
            this.category = (__runInitializers(this, _difficulty_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            // Armazena a lista de exercícios como JSONB
            this.exercisesList = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _exercisesList_initializers, void 0));
            this.createdAt = (__runInitializers(this, _exercisesList_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            // Relação com o Atleta
            this.athlete = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _athlete_initializers, void 0));
            this.athleteId = (__runInitializers(this, _athlete_extraInitializers), __runInitializers(this, _athleteId_initializers, void 0));
            __runInitializers(this, _athleteId_extraInitializers);
        }
        return Workout_1;
    }());
    __setFunctionName(_classThis, "Workout");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _name_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)("text", { nullable: true })];
        _duration_decorators = [(0, typeorm_1.Column)({ default: "45 min" })];
        _restTime_decorators = [(0, typeorm_1.Column)({ default: "60s" })];
        _difficulty_decorators = [(0, typeorm_1.Column)({ default: "intermediate" })];
        _category_decorators = [(0, typeorm_1.Column)()];
        _exercisesList_decorators = [(0, typeorm_1.Column)("jsonb", { default: [] })];
        _createdAt_decorators = [(0, typeorm_1.Column)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP"; } })];
        _athlete_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.workouts; }), (0, typeorm_1.JoinColumn)({ name: "athleteId" })];
        _athleteId_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: function (obj) { return "duration" in obj; }, get: function (obj) { return obj.duration; }, set: function (obj, value) { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
        __esDecorate(null, null, _restTime_decorators, { kind: "field", name: "restTime", static: false, private: false, access: { has: function (obj) { return "restTime" in obj; }, get: function (obj) { return obj.restTime; }, set: function (obj, value) { obj.restTime = value; } }, metadata: _metadata }, _restTime_initializers, _restTime_extraInitializers);
        __esDecorate(null, null, _difficulty_decorators, { kind: "field", name: "difficulty", static: false, private: false, access: { has: function (obj) { return "difficulty" in obj; }, get: function (obj) { return obj.difficulty; }, set: function (obj, value) { obj.difficulty = value; } }, metadata: _metadata }, _difficulty_initializers, _difficulty_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _exercisesList_decorators, { kind: "field", name: "exercisesList", static: false, private: false, access: { has: function (obj) { return "exercisesList" in obj; }, get: function (obj) { return obj.exercisesList; }, set: function (obj, value) { obj.exercisesList = value; } }, metadata: _metadata }, _exercisesList_initializers, _exercisesList_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _athlete_decorators, { kind: "field", name: "athlete", static: false, private: false, access: { has: function (obj) { return "athlete" in obj; }, get: function (obj) { return obj.athlete; }, set: function (obj, value) { obj.athlete = value; } }, metadata: _metadata }, _athlete_initializers, _athlete_extraInitializers);
        __esDecorate(null, null, _athleteId_decorators, { kind: "field", name: "athleteId", static: false, private: false, access: { has: function (obj) { return "athleteId" in obj; }, get: function (obj) { return obj.athleteId; }, set: function (obj, value) { obj.athleteId = value; } }, metadata: _metadata }, _athleteId_initializers, _athleteId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Workout = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Workout = _classThis;
}();
exports.Workout = Workout;
