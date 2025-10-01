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
exports.Exercise = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/entities/user.entity");
var Exercise = function () {
    var _classDecorators = [(0, typeorm_1.Entity)("exercises")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _muscleGroup_decorators;
    var _muscleGroup_initializers = [];
    var _muscleGroup_extraInitializers = [];
    var _equipment_decorators;
    var _equipment_initializers = [];
    var _equipment_extraInitializers = [];
    var _difficulty_decorators;
    var _difficulty_initializers = [];
    var _difficulty_extraInitializers = [];
    var _instructions_decorators;
    var _instructions_initializers = [];
    var _instructions_extraInitializers = [];
    var _tips_decorators;
    var _tips_initializers = [];
    var _tips_extraInitializers = [];
    var _trainer_decorators;
    var _trainer_initializers = [];
    var _trainer_extraInitializers = [];
    var _trainerId_decorators;
    var _trainerId_initializers = [];
    var _trainerId_extraInitializers = [];
    var Exercise = _classThis = /** @class */ (function () {
        function Exercise_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.muscleGroup = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _muscleGroup_initializers, void 0));
            this.equipment = (__runInitializers(this, _muscleGroup_extraInitializers), __runInitializers(this, _equipment_initializers, void 0));
            this.difficulty = (__runInitializers(this, _equipment_extraInitializers), __runInitializers(this, _difficulty_initializers, void 0));
            this.instructions = (__runInitializers(this, _difficulty_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
            this.tips = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _tips_initializers, void 0));
            // Define o treinador que criou o exercício (se for personalizado)
            this.trainer = (__runInitializers(this, _tips_extraInitializers), __runInitializers(this, _trainer_initializers, void 0));
            this.trainerId = (__runInitializers(this, _trainer_extraInitializers), __runInitializers(this, _trainerId_initializers, void 0));
            __runInitializers(this, _trainerId_extraInitializers);
        }
        return Exercise_1;
    }());
    __setFunctionName(_classThis, "Exercise");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _name_decorators = [(0, typeorm_1.Column)()];
        _muscleGroup_decorators = [(0, typeorm_1.Column)()];
        _equipment_decorators = [(0, typeorm_1.Column)()];
        _difficulty_decorators = [(0, typeorm_1.Column)({ default: "intermediate" })];
        _instructions_decorators = [(0, typeorm_1.Column)("text", { array: true, nullable: true })];
        _tips_decorators = [(0, typeorm_1.Column)("text", { array: true, nullable: true })];
        _trainer_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }), (0, typeorm_1.JoinColumn)({ name: "trainerId" })];
        _trainerId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _muscleGroup_decorators, { kind: "field", name: "muscleGroup", static: false, private: false, access: { has: function (obj) { return "muscleGroup" in obj; }, get: function (obj) { return obj.muscleGroup; }, set: function (obj, value) { obj.muscleGroup = value; } }, metadata: _metadata }, _muscleGroup_initializers, _muscleGroup_extraInitializers);
        __esDecorate(null, null, _equipment_decorators, { kind: "field", name: "equipment", static: false, private: false, access: { has: function (obj) { return "equipment" in obj; }, get: function (obj) { return obj.equipment; }, set: function (obj, value) { obj.equipment = value; } }, metadata: _metadata }, _equipment_initializers, _equipment_extraInitializers);
        __esDecorate(null, null, _difficulty_decorators, { kind: "field", name: "difficulty", static: false, private: false, access: { has: function (obj) { return "difficulty" in obj; }, get: function (obj) { return obj.difficulty; }, set: function (obj, value) { obj.difficulty = value; } }, metadata: _metadata }, _difficulty_initializers, _difficulty_extraInitializers);
        __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: function (obj) { return "instructions" in obj; }, get: function (obj) { return obj.instructions; }, set: function (obj, value) { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
        __esDecorate(null, null, _tips_decorators, { kind: "field", name: "tips", static: false, private: false, access: { has: function (obj) { return "tips" in obj; }, get: function (obj) { return obj.tips; }, set: function (obj, value) { obj.tips = value; } }, metadata: _metadata }, _tips_initializers, _tips_extraInitializers);
        __esDecorate(null, null, _trainer_decorators, { kind: "field", name: "trainer", static: false, private: false, access: { has: function (obj) { return "trainer" in obj; }, get: function (obj) { return obj.trainer; }, set: function (obj, value) { obj.trainer = value; } }, metadata: _metadata }, _trainer_initializers, _trainer_extraInitializers);
        __esDecorate(null, null, _trainerId_decorators, { kind: "field", name: "trainerId", static: false, private: false, access: { has: function (obj) { return "trainerId" in obj; }, get: function (obj) { return obj.trainerId; }, set: function (obj, value) { obj.trainerId = value; } }, metadata: _metadata }, _trainerId_initializers, _trainerId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Exercise = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Exercise = _classThis;
}();
exports.Exercise = Exercise;
